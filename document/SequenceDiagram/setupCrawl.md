```mermaid
sequenceDiagram
    User->>+Frontend: Enter param
    Frontend->>+Web Server: Send create crawler
    Web Server->>+Database: Insert crawler
    Database-->>-Web Server: Success
    Web Server-)Cronjob: Setup cronjob for crawler
    Web Server-->>-Frontend: Success
    Frontend-->>-User: Success
```