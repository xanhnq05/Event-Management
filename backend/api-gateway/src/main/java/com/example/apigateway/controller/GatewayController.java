package com.example.apigateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GatewayController {
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final String AUTH_SERVICE = "http://auth-service:8081";
    private static final String EVENT_SERVICE = "http://event-service:8082";
    private static final String USER_SERVICE = "http://user-service:8083";
    private static final String PAYMENT_SERVICE = "http://payment-service:8084";

    @RequestMapping("/auth/**")
    public ResponseEntity<?> authProxy(@RequestBody(required = false) Object body, 
                                       HttpMethod method, 
                                       HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api", "");
        return proxyRequest(AUTH_SERVICE + path, method, body);
    }

    @RequestMapping("/events/**")
    public ResponseEntity<?> eventProxy(@RequestBody(required = false) Object body, 
                                       HttpMethod method, 
                                       HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api", "");
        return proxyRequest(EVENT_SERVICE + path, method, body);
    }

    @RequestMapping("/users/**")
    public ResponseEntity<?> userProxy(@RequestBody(required = false) Object body, 
                                      HttpMethod method, 
                                      HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api", "");
        return proxyRequest(USER_SERVICE + path, method, body);
    }

    @RequestMapping("/payments/**")
    public ResponseEntity<?> paymentProxy(@RequestBody(required = false) Object body, 
                                         HttpMethod method, 
                                         HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api", "");
        return proxyRequest(PAYMENT_SERVICE + path, method, body);
    }

    private ResponseEntity<?> proxyRequest(String url, HttpMethod method, Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        
        try {
            return restTemplate.exchange(url, method, entity, Object.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

