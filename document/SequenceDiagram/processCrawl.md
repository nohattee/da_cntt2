```mermaid
sequenceDiagram
    autonumber 

    Cronjob->>+Database: Get all URL and settings of crawlers
    Database-->>-Cronjob: URL and settings of crawlers
    loop each crawler
        Cronjob->>+Tool Crawler: Send URL and settings of crawler
        loop each page of URL
            Tool Crawler->>+Tool Crawler: Start crawling
            Tool Crawler->>+Internet: Get resource from URL
            Internet-->>-Tool Crawler: Resource
            Tool Crawler->>Tool Crawler: Extract data from resource
            Tool Crawler->>+Database: Insert extracted data
            Database->>-Tool Crawler: Success
            deactivate Tool Crawler
        end
        
        Tool Crawler-->>-Cronjob: Finish
    end
```