# Performance Monitoring with Node.js Performance Hooks API

## Overview
This implementation uses Node.js built-in Performance Hooks API to monitor response times, identify bottlenecks, and track system metrics in real-time.

## Features Implemented

### 1. **Automatic HTTP Request Monitoring**
- Tracks response time for every API endpoint
- Logs slow operations (>1 second)
- Warns about moderately slow operations (>500ms)
- Includes HTTP status code in logs

### 2. **Database Query Performance Tracking**
- Measures database operation duration
- Identifies slow queries
- Easy to wrap any async operation

### 3. **System Metrics Logging**
- Memory usage tracking (RSS, Heap)
- Process uptime
- Logged every 5 minutes in production

## How It Works

### Middleware (Automatic)
The `performanceMonitor` middleware is already added to server.js and automatically tracks all HTTP requests:

### Manual Performance Measurement


## Configuration

### Thresholds (in performanceMonitor.js)

```javascript
const SLOW_OPERATION_THRESHOLD = 1000; // Log as ERROR if > 1000ms
const WARNING_THRESHOLD = 500;          // Log as WARN if > 500ms
```


## Benefits

✅ **Identify Bottlenecks**: See exactly which endpoints/queries are slow  
✅ **Real-time Monitoring**: Track performance in production  
✅ **No External Dependencies**: Built-in Node.js API  
✅ **Low Overhead**: Minimal impact on performance  
✅ **Automatic Tracking**: All HTTP requests monitored automatically  
✅ **Integrated with Winston**: All logs go to log files for analysis  


## Performance Optimization Checklist

Based on performance logs, optimize:

- [ ] Add MongoDB indexes for frequently queried fields
- [ ] Implement response caching for static/slow queries
- [ ] Paginate large data responses
- [ ] Optimize database populate() calls
- [ ] Move heavy processing to worker threads
- [ ] Enable compression for large responses


