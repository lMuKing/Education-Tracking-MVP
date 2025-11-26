const { PerformanceObserver, performance } = require('perf_hooks');
const logger = require('../Config/logger');

// Track slow operations threshold (in milliseconds)
const SLOW_OPERATION_THRESHOLD = 1000; // Sets 1000ms (1 second) as the limit for operations considered "slow"
const WARNING_THRESHOLD = 500; // Sets 500ms as the limit for operations that trigger warnings

// Store request metrics for accurate per-request measurements
const requestMetrics = new Map();

// Performance Observer to track all measurements
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    const duration = entry.duration.toFixed(2);
    
    // Only log HTTP requests to console, always show detailed metrics
    if (entry.name.includes('GET') || entry.name.includes('POST') || 
        entry.name.includes('PUT') || entry.name.includes('DELETE') || 
        entry.name.includes('PATCH')) {
      
      // Retrieve stored metrics for this request
      const metrics = requestMetrics.get(entry.name);
      
      if (metrics) {
        const memUsage = getMemoryUsage();
        const cpuEnd = process.cpuUsage(metrics.cpuStart);
        
        // Calculate CPU usage percentage during this request
        const cpuTimeMs = (cpuEnd.user + cpuEnd.system) / 1000; // Convert microseconds to milliseconds
        const cpuPercent = ((cpuTimeMs / parseFloat(duration)) * 100).toFixed(2);
        
        // Calculate memory changes
        const heapUsedDelta = (parseFloat(memUsage.heapUsed) - metrics.heapUsedStart).toFixed(2);
        
        const logData = {
          endpoint: entry.name,
          responseTime: `${duration}ms`,
          memory: {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            rss: memUsage.rss,
            delta: `${heapUsedDelta > 0 ? '+' : ''}${heapUsedDelta} MB`, // Memory change during request
          },
          cpu: {
            usage: `${cpuPercent}%`, // CPU percentage during request
            userTime: `${(cpuEnd.user / 1000).toFixed(2)}ms`,
            systemTime: `${(cpuEnd.system / 1000).toFixed(2)}ms`,
          }
        };
        
        // Color-code based on performance
        if (entry.duration > SLOW_OPERATION_THRESHOLD) {
          logger.error('🔴 SLOW REQUEST', logData);
        } else if (entry.duration > WARNING_THRESHOLD) {
          logger.warn('🟡 SLOW REQUEST', logData);
        } else {
          logger.info('🟢 REQUEST', logData);
        }
        
        // Clean up stored metrics
        requestMetrics.delete(entry.name);
      }
    } else {
      // Non-HTTP operations only logged to file
      logger.debug('Performance measurement', {
        name: entry.name,
        duration: `${duration}ms`,
      });
    }
  });
});

// Observe all performance measure entries
obs.observe({ entryTypes: ['measure'], buffered: true });

/**
 * Middleware to track HTTP request performance
 */
const performanceMonitor = (req, res, next) => {
  const requestId = `${req.method} ${req.originalUrl}`;
  const startMark = `request-start-${Date.now()}-${Math.random()}`;
  const endMark = `request-end-${Date.now()}-${Math.random()}`;
  
  // Capture baseline metrics at request start
  const memUsage = getMemoryUsage();
  const heapUsedStart = parseFloat(memUsage.heapUsed);
  const cpuStart = process.cpuUsage();
  
  // Mark the start of the request
  performance.mark(startMark);
  
  // Capture when response finishes
  const originalSend = res.send;
  res.send = function(data) {
    // Mark the end of the request
    performance.mark(endMark);
    
    const measureName = `${requestId} [${res.statusCode}]`;
    
    // Store metrics for this request
    requestMetrics.set(measureName, {
      cpuStart,
      heapUsedStart,
    });
    
    // Measure the duration
    try {
      performance.measure(measureName, startMark, endMark);
      
      // Clean up marks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    } catch (error) {
      logger.error('Performance measurement error:', { error: error.message });
      requestMetrics.delete(measureName);
    }
    
    // Call original send
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Utility function to measure async operations
 * @param {string} name - Name of the operation
 * @param {Function} fn - Async function to measure
 */
const measureAsync = async (name, fn) => {
  const startMark = `${name}-start-${Date.now()}`;
  const endMark = `${name}-end-${Date.now()}`;
  
  performance.mark(startMark);
  
  try {
    const result = await fn();
    performance.mark(endMark);
    performance.measure(name, startMark, endMark);
    
    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    
    return result;
  } catch (error) {
    performance.mark(endMark);
    performance.measure(`${name} [ERROR]`, startMark, endMark);
    
    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    
    throw error;
  }
};

/**
 * Utility function to measure sync operations
 * @param {string} name - Name of the operation
 * @param {Function} fn - Sync function to measure
 */
const measureSync = (name, fn) => {
  const startMark = `${name}-start-${Date.now()}`;
  const endMark = `${name}-end-${Date.now()}`;
  
  performance.mark(startMark);
  
  try {
    const result = fn();
    performance.mark(endMark);
    performance.measure(name, startMark, endMark);
    
    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    
    return result;
  } catch (error) {
    performance.mark(endMark);
    performance.measure(`${name} [ERROR]`, startMark, endMark);
    
    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    
    throw error;
  }
};

/**
 * Get current memory usage
 */
const getMemoryUsage = () => {
  const usage = process.memoryUsage();
  return {
    rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`,
  };
};

/**
 * Log system performance metrics
 */
const logSystemMetrics = () => {
  const memUsage = getMemoryUsage();
  const uptime = process.uptime();
  
  logger.info(' System Performance Metrics', {
    memory: memUsage,
    uptime: `${(uptime / 60).toFixed(2)} minutes`,
    pid: process.pid,
  });
};

// Log system metrics every 5 minutes in production
if (process.env.NODE_ENV === 'production') {
  setInterval(logSystemMetrics, 5 * 60 * 1000);
}

module.exports = {
  performanceMonitor,
  measureAsync,
  measureSync,
  getMemoryUsage,
  logSystemMetrics,
};
