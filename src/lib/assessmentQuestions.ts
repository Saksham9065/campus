export type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  skill: string;
};

export type QuestionBank = Record<string, Question[]>;

function shuffleOptions(
  options: string[],
  correct: number
): { options: string[]; correct: number } {
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map((i) => options[i]);
  const newCorrect = indices.indexOf(correct);
  return { options: shuffled, correct: newCorrect };
}

export function getShuffledQuestionsForRole(
  role: string
): Question[] {
  const questions = getQuestionsForRole(role);

  return questions.map((q) => {
    const { options, correct } =
      shuffleOptions(q.options, q.correct);

    return {
      ...q,
      options,
      correct,
    };
  });
}

export const questionBank: QuestionBank = {
  "AI & Full Stack": [
    {
      id: "ai-fullstack-q1",
      question:
        "A student dashboard loads profile data, assessment results, and recommended jobs. The page currently waits for the profile API to finish before requesting the other two APIs. This makes the page unnecessarily slow. What is the best approach?",
      options: [
        "Make all requests sequentially",
        "Execute independent requests in parallel",
        "Increase the API timeout",
        "Store all data in cookies",
      ],
      correct: 1,
      skill: "Full Stack Performance",
    },
    {
      id: "ai-fullstack-q2",
      question:
        "An AI-powered job matcher receives 10,000 job descriptions. Comparing every student profile against every job requires O(N × M) comparisons. Which approach can significantly improve retrieval for similar jobs?",
      options: [
        "Randomly remove jobs",
        "Convert profiles/jobs into embeddings and use vector similarity search",
        "Sort jobs alphabetically",
        "Increase the frontend bundle size",
      ],
      correct: 1,
      skill: "AI & Search",
    },
    {
      id: "ai-fullstack-q3",
      question:
        "A React application sends the same expensive AI request whenever a user navigates away and returns to a page. The result rarely changes. What is the best optimization?",
      options: [
        "Disable authentication",
        "Cache the AI result",
        "Send the request twice",
        "Store the API key in the browser",
      ],
      correct: 1,
      skill: "Frontend Optimization",
    },
    {
      id: "ai-fullstack-q4",
      question:
        "A backend endpoint receives POST /api/apply. Two identical requests arrive almost simultaneously because the user double-clicked the Apply button. Two applications are created. What is the strongest backend solution?",
      options: [
        "Disable CSS animations",
        "Use an idempotency mechanism or unique database constraint",
        "Increase frontend font size",
        "Add another button",
      ],
      correct: 1,
      skill: "Backend Reliability",
    },
    {
      id: "ai-fullstack-q5",
      question:
        "An AI model generates a job recommendation based on a student's skills. The model occasionally recommends jobs requiring skills the student does not possess. Which architecture is most reliable?",
      options: [
        "Trust the model completely",
        "Use deterministic skill filtering before/after AI ranking",
        "Remove the student's skills",
        "Randomize recommendations",
      ],
      correct: 1,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q6",
      question:
        "A Firestore query filters opportunities by status and sorts them by postedAt. Users receive an error saying the query requires an index. What should the developer do?",
      options: [
        "Remove Firebase Authentication",
        "Create the required composite Firestore index",
        "Convert Firestore to SQL immediately",
        "Remove postedAt from documents",
      ],
      correct: 1,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q7",
      question:
        "An AI chatbot allows users to submit arbitrary prompts. A malicious user asks the model to reveal the application's secret API key. Where should the secret key be stored?",
      options: [
        "React component",
        "Browser localStorage",
        "Server-side environment variable",
        "URL query parameter",
      ],
      correct: 2,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q8",
      question:
        "An application processes uploaded resumes. A user uploads a 50 MB PDF, causing the server to consume excessive memory. What is the most appropriate first step?",
      options: [
        "Remove file validation",
        "Enforce file-size/type limits before processing",
        "Convert every file to PNG",
        "Increase the frontend font size",
      ],
      correct: 1,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q9",
      question:
        "A recommendation API takes 5 seconds to generate results. Users repeatedly click the button while waiting, creating multiple expensive AI requests. What should the frontend do?",
      options: [
        "Allow unlimited requests",
        "Disable/debounce the action while the request is pending",
        "Refresh the page after every click",
        "Open a new tab for every request",
      ],
      correct: 1,
      skill: "Frontend UX",
    },
    {
      id: "ai-fullstack-q10",
      question:
        "A full-stack application stores authentication tokens in a way that JavaScript running on the page can freely access them. An XSS vulnerability occurs. Which storage strategy generally provides stronger protection against JavaScript token theft?",
      options: [
        "HTTP-only secure cookies",
        "URL parameters",
        "Plaintext localStorage",
        "Global JavaScript variables",
      ],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q11",
      question:
        'An AI service sometimes returns malformed JSON: {"skills": ["React", "Node"]. The frontend crashes when it tries to parse the response. What should the backend do?',
      options: [
        "Assume AI output is always valid",
        "Validate and safely parse the model output",
        "Send the raw response directly",
        "Remove error handling",
      ],
      correct: 1,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q12",
      question:
        "A dashboard displays 20,000 opportunities simultaneously and becomes extremely slow. The user normally sees only 20 items at a time. Which technique is most appropriate?",
      options: [
        "Render all 20,000 items",
        "Pagination or list virtualization",
        "Increase image sizes",
        "Disable browser caching",
      ],
      correct: 1,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q13",
      question:
        "An AI application sends the entire student's history to the model for every request. Token usage and latency are becoming expensive. What is a better architecture?",
      options: [
        "Send even more historical data",
        "Retrieve only relevant information and summarize where appropriate",
        "Disable the AI",
        "Duplicate the history",
      ],
      correct: 1,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q14",
      question:
        "A job recommendation system produces the same ranking for every student because the backend accidentally uses a global cached result. What is the most likely bug?",
      options: [
        "Cache key does not include the student's relevant identity/input",
        "CSS is incorrect",
        "HTTP method is too long",
        "Database password is too short",
      ],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q15",
      question:
        "A frontend sends: GET /api/jobs?skill=React. The backend directly concatenates the parameter into a SQL query. Which problem can this introduce?",
      options: [
        "Memory leak only",
        "SQL injection",
        "Faster execution",
        "Better caching",
      ],
      correct: 1,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q16",
      question:
        "A system has the following architecture: React → API → AI Model → Database. The AI model is temporarily unavailable. Users should still be able to browse existing job opportunities. What is the best design?",
      options: [
        "Make the entire application unavailable",
        "Gracefully degrade and serve database-backed features independently",
        "Delete the database",
        "Redirect every request to the AI model",
      ],
      correct: 1,
      skill: "System Design",
    },
    {
      id: "ai-fullstack-q17",
      question:
        "An AI matching algorithm calculates: skill match = 70%, experience match = 80%. The product requirement says skill match should contribute 60% and experience 40%. What should the final score be?",
      options: ["72%", "74%", "75%", "80%"],
      correct: 1,
      skill: "AI & Logic",
    },
    {
      id: "ai-fullstack-q18",
      question:
        "A Next.js page contains sensitive database credentials inside code prefixed with NEXT_PUBLIC_. What is the problem?",
      options: [
        "The variable becomes slower",
        "Public environment variables can be exposed to the client",
        "Firestore automatically deletes the variable",
        "Next.js encrypts it automatically",
      ],
      correct: 1,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q19",
      question:
        "A user submits an application and immediately navigates to the Applications page. Sometimes the new application does not appear immediately because the database listener has not received the update yet. Which UI strategy can improve perceived responsiveness?",
      options: [
        "Optimistic UI with proper rollback/error handling",
        "Delete the application",
        "Disable the Applications page",
        "Refresh continuously every 100 ms",
      ],
      correct: 0,
      skill: "Frontend UX",
    },
    {
      id: "ai-fullstack-q20",
      question:
        "An AI + Full Stack application needs to handle increasing traffic. The frontend is already statically optimized, but the AI endpoint and database are becoming bottlenecks. Which approach is most appropriate?",
      options: [
        "Put all processing inside the browser",
        "Scale backend services, optimize database queries, cache appropriate results, and queue expensive AI tasks",
        "Increase HTML size",
        "Remove database indexes",
      ],
      correct: 1,
      skill: "System Design",
    },
    {
      id: "ai-fullstack-q21",
      question:
        "A React component receives a large array of products as a prop. The component performs an expensive calculation on every render even when the products haven't changed. What is the best optimization?",
      options: ["useMemo", "useEffect", "useRef", "useState"],
      correct: 0,
      skill: "Frontend Performance",
    },
    {
      id: "ai-fullstack-q22",
      question:
        "An API endpoint returns 50,000 records even though the UI displays only 20. What should be implemented?",
      options: ["Pagination", "More CSS", "Client-side sorting only", "Larger JSON objects"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q23",
      question:
        "A user searches for 'React' while typing. An API request is sent for every keystroke. What technique reduces unnecessary requests?",
      options: ["Debouncing", "Recursion", "Hashing", "Encryption"],
      correct: 0,
      skill: "Frontend UX",
    },
    {
      id: "ai-fullstack-q24",
      question:
        "A database query retrieves every user's record and then filters them in JavaScript. The database contains millions of records. What is the better approach?",
      options: ["Filter in the database", "Fetch everything first", "Use more frontend components", "Convert results to XML"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q25",
      question:
        "A Node.js API performs a CPU-intensive image-processing operation directly inside the request handler. During processing, other requests become slow. What is the best solution?",
      options: ["Use background workers/jobs", "Increase HTML size", "Add more buttons", "Disable authentication"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q26",
      question:
        "An AI application receives thousands of identical questions. Calling the model for every identical request is expensive. What can reduce cost?",
      options: ["Response caching", "Random responses", "Larger prompts", "Disable logging"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q27",
      question:
        "A user changes their profile in one browser tab, but another tab still shows old data. Which mechanism can help synchronize state?",
      options: ["Real-time listener or cross-tab synchronization", "CSS animation", "Image compression", "HTML comments"],
      correct: 0,
      skill: "Frontend UX",
    },
    {
      id: "ai-fullstack-q28",
      question:
        "An API occasionally fails because an external AI service temporarily returns HTTP 503. What is an appropriate strategy?",
      options: ["Retry with exponential backoff", "Retry continuously without delay", "Ignore the error", "Delete the request"],
      correct: 0,
      skill: "Backend Reliability",
    },
    {
      id: "ai-fullstack-q29",
      question:
        "A database contains 10 million jobs. Users frequently query jobs by companyId. What can improve query performance?",
      options: ["Database index on companyId", "Remove the field", "Store data in HTML", "Use CSS indexing"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q30",
      question:
        "A user uploads a resume and expects the AI to extract skills. The extraction takes 15 seconds. What is a better UX?",
      options: ["Show progress/loading state", "Freeze the browser", "Reload every second", "Hide the application"],
      correct: 0,
      skill: "Frontend UX",
    },
    {
      id: "ai-fullstack-q31",
      question:
        "An AI model gives a confidence score of 0.92 for a classification. What does this generally represent?",
      options: [
        "The model's estimated confidence in its prediction",
        "Database size",
        "Number of users",
        "API response time",
      ],
      correct: 0,
      skill: "AI Fundamentals",
    },
    {
      id: "ai-fullstack-q32",
      question:
        "A full-stack application has repeated database queries for the same configuration data. What is the simplest optimization?",
      options: ["Cache relatively static configuration data", "Query the database twice", "Remove the configuration", "Increase request payload"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q33",
      question:
        "A REST API uses POST /users/123 to retrieve a user's profile without modifying data. Which HTTP method is more appropriate?",
      options: ["GET", "POST", "DELETE", "PATCH"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q34",
      question:
        "A client sends a request containing a password. Which transport mechanism should be used?",
      options: ["HTTPS", "HTTP", "FTP", "Telnet"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q35",
      question:
        "An API accepts a limit parameter. A malicious user sends limit=999999999. What should the backend do?",
      options: ["Enforce a maximum limit", "Accept it unconditionally", "Shut down the database", "Ignore authentication"],
      correct: 0,
      skill: "Backend Security",
    },
    {
      id: "ai-fullstack-q36",
      question:
        "A React application displays stale data after a mutation because local state wasn't updated. What should happen after a successful mutation?",
      options: ["Update or invalidate the relevant cached state", "Delete all application state", "Close the browser", "Restart the server"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q37",
      question:
        "An AI model is repeatedly given a 10,000-token document although only one paragraph is relevant. What architecture is more efficient?",
      options: ["Retrieval of relevant chunks", "Duplicate the document", "Increase the document size", "Send the document twice"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q38",
      question:
        "A backend receives JSON from an untrusted client. What should happen before using the data?",
      options: ["Validate the input", "Trust it directly", "Store it blindly", "Execute it as code"],
      correct: 0,
      skill: "Backend Security",
    },
    {
      id: "ai-fullstack-q39",
      question:
        "An application stores user passwords directly in a database. If the database leaks, attackers can immediately see them. What should be used?",
      options: ["Strong password hashing", "Base64 encoding", "Plain text", "URL encoding"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q40",
      question:
        "Two users simultaneously update the same database record. One update unexpectedly overwrites the other. What technique can help?",
      options: ["Optimistic concurrency/version checking", "Remove timestamps", "Disable the database", "Use larger JSON"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q41",
      question:
        "A search system needs to find 'machine learning' even when the exact phrase doesn't appear in a document but related concepts do. Which technology is particularly useful?",
      options: ["Semantic/vector search", "Exact string comparison only", "Alphabetical sorting", "CSS selectors"],
      correct: 0,
      skill: "AI & Search",
    },
    {
      id: "ai-fullstack-q42",
      question:
        "An API returns: { 'success': true, 'data': null }. The frontend assumes data always exists and crashes. What is the best fix?",
      options: ["Validate/null-check API responses", "Remove API responses", "Hide the error", "Refresh continuously"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q43",
      question:
        "A React page has a component that unnecessarily re-renders when unrelated parent state changes. Which technique can prevent unnecessary child renders?",
      options: ["React.memo", "JSON.parse", "fetch", "localStorage.clear"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q44",
      question:
        "An API endpoint accepts an email address. A user sends an invalid email format. Where should validation ideally occur?",
      options: ["Both client and server", "Client only", "Server only", "Nowhere"],
      correct: 0,
      skill: "Full Stack Validation",
    },
    {
      id: "ai-fullstack-q45",
      question:
        "A server stores uploaded resumes using the original filename. Two users upload resume.pdf. What problem can occur?",
      options: ["Filename collision", "Faster database queries", "Better security", "Lower latency"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q46",
      question:
        "What is a safer way to store uploaded files with potentially duplicate names?",
      options: ["Generate unique storage keys", "Always overwrite files", "Use the same filename", "Remove file extensions"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q47",
      question:
        "A user is authenticated but attempts to access another user's application using its ID. What security check is required?",
      options: ["Authorization/ownership check", "CSS validation", "Browser refresh", "Image validation"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q48",
      question:
        "An AI service requires a secret API key. Where should the key normally be used?",
      options: ["Server-side", "Public frontend code", "HTML source", "URL"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q49",
      question:
        "A server receives 100 identical expensive requests within one second. Which technique can prevent duplicate work?",
      options: ["Request deduplication", "Increase response size", "Remove caching", "Disable logging"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q50",
      question:
        "A database query returns documents sorted by createdAt, but no index exists for the required compound query. What should be done?",
      options: ["Create the required composite index", "Delete the collection", "Remove authentication", "Convert dates to strings randomly"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q51",
      question:
        "A user asks an AI system for the latest company information. The model's training data may be outdated. What should the system use?",
      options: ["Current external data retrieval", "Older cached model knowledge only", "Random information", "No validation"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q52",
      question:
        "An AI chatbot repeatedly produces long irrelevant answers. Which prompt strategy can help?",
      options: ["Explicitly define output constraints", "Remove the task description", "Increase irrelevant context", "Ask for unlimited output"],
      correct: 0,
      skill: "AI Engineering",
    },
    {
      id: "ai-fullstack-q53",
      question:
        "A backend endpoint returns sensitive user information to anyone who knows the endpoint URL. What is missing?",
      options: ["Authentication and authorization", "CSS", "Pagination only", "Compression"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q54",
      question:
        "An application has 100 API endpoints and all contain duplicated authentication logic. What architectural improvement is appropriate?",
      options: ["Centralized middleware", "Duplicate the code further", "Remove authentication", "Move credentials into HTML"],
      correct: 0,
      skill: "Backend Architecture",
    },
    {
      id: "ai-fullstack-q55",
      question:
        "An API receives 1,000 requests per second from one IP and overwhelms the service. What can limit abuse?",
      options: ["Rate limiting", "Larger images", "More frontend forms", "Disable HTTPS"],
      correct: 0,
      skill: "Backend Security",
    },
    {
      id: "ai-fullstack-q56",
      question:
        "A database stores timestamps from users around the world. What is generally best for storage?",
      options: ["UTC timestamps", "Local time only", "Browser clock only", "Random timezone"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q57",
      question:
        "An AI-generated answer contains a factual claim that must be traceable to company documents. What approach improves trust?",
      options: ["Retrieval with source citations", "Increase temperature only", "Remove documents", "Generate random citations"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q58",
      question:
        "A user submits the same payment request twice due to network retry. What prevents duplicate processing?",
      options: ["Idempotency key", "Larger button", "CSS lock", "More database fields"],
      correct: 0,
      skill: "Backend Reliability",
    },
    {
      id: "ai-fullstack-q59",
      question:
        "A frontend needs to display a large dataset but only a small portion is visible on screen. Which technique reduces DOM work?",
      options: ["Virtualized list", "Render everything", "Duplicate elements", "Disable scrolling"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q60",
      question:
        "A backend service depends on another API. That API is slow and unreliable. What pattern can isolate failures?",
      options: ["Circuit breaker", "Infinite retries", "Remove timeout", "Ignore failures"],
      correct: 0,
      skill: "Backend Architecture",
    },
    {
      id: "ai-fullstack-q61",
      question:
        "A developer wants to identify which backend operation causes production latency. What should be added?",
      options: ["Structured logging and tracing", "More CSS", "Random delays", "Remove logs"],
      correct: 0,
      skill: "Backend Operations",
    },
    {
      id: "ai-fullstack-q62",
      question:
        "An API returns thousands of fields even though the client needs only five. What can improve efficiency?",
      options: ["Return only required fields", "Add more fields", "Duplicate responses", "Disable compression"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q63",
      question:
        "A user enters: <script>alert('x')</script> and the application renders it as HTML. What vulnerability may result?",
      options: ["XSS", "DDoS", "DNS poisoning", "Packet loss"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q64",
      question:
        "An application needs to perform email sending after a user registers. The email service is slow. What is a good architecture?",
      options: ["Queue the email task", "Block registration until email completes", "Remove email", "Refresh the page"],
      correct: 0,
      skill: "Backend Architecture",
    },
    {
      id: "ai-fullstack-q65",
      question:
        "A queue contains tasks: A B C D. Tasks should be processed in arrival order. Which structure is appropriate?",
      options: ["Queue", "Stack", "Max heap", "Binary tree"],
      correct: 0,
      skill: "Data Structures",
    },
    {
      id: "ai-fullstack-q66",
      question:
        "An AI application needs to select the top 5 most relevant documents from 100,000 candidates. Which approach is appropriate?",
      options: ["Vector similarity retrieval with top-K results", "Return all documents", "Random selection", "Alphabetical selection"],
      correct: 0,
      skill: "AI & Search",
    },
    {
      id: "ai-fullstack-q67",
      question:
        "A database has duplicate student records because there is no unique constraint on email. What should be considered?",
      options: ["Unique constraint/index", "Remove email", "Duplicate records intentionally", "Client-side sorting"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q68",
      question:
        "A frontend application stores a huge object in React state and updates one tiny field frequently. What could improve performance?",
      options: ["Keep state appropriately normalized/split", "Duplicate the object", "Reload the page", "Store everything globally"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q69",
      question:
        "A user has permission to view their own profile but not another user's profile. Which concept enforces this?",
      options: ["Authorization", "Authentication only", "Compression", "Serialization"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q70",
      question:
        "A user enters a very long string into a search box, causing expensive processing. What should the backend enforce?",
      options: ["Input length limits", "Unlimited input", "Disable validation", "Increase database size"],
      correct: 0,
      skill: "Backend Security",
    },
    {
      id: "ai-fullstack-q71",
      question:
        "An AI model's output varies significantly for the same input because the temperature is high. If deterministic output is preferred, what should be done?",
      options: ["Lower the temperature", "Increase temperature", "Remove the prompt", "Add random text"],
      correct: 0,
      skill: "AI Engineering",
    },
    {
      id: "ai-fullstack-q72",
      question:
        "A recommendation system has excellent overall accuracy but performs poorly for a small group of users. What should be investigated?",
      options: ["Performance across user segments", "Only overall accuracy", "CSS performance", "Database filename"],
      correct: 0,
      skill: "AI Evaluation",
    },
    {
      id: "ai-fullstack-q73",
      question:
        "A model is trained on data where one class appears 99% of the time. Accuracy is 99%, but the minority class is never detected. Which metric is especially useful?",
      options: ["Precision/Recall/F1", "File size", "API latency only", "CPU frequency"],
      correct: 0,
      skill: "AI Evaluation",
    },
    {
      id: "ai-fullstack-q74",
      question:
        "An AI application sends personally sensitive information to an external model unnecessarily. What is a better design?",
      options: ["Minimize/redact sensitive data before sending", "Send everything", "Put secrets in prompts", "Log all personal data"],
      correct: 0,
      skill: "AI Security",
    },
    {
      id: "ai-fullstack-q75",
      question:
        "A backend API must return an error when a requested resource does not exist. Which HTTP status is appropriate?",
      options: ["404", "200", "301", "100"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q76",
      question:
        "A new application version changes the API response format and breaks older clients. What strategy can reduce compatibility problems?",
      options: ["API versioning/backward compatibility", "Delete old clients", "Change responses randomly", "Disable the API"],
      correct: 0,
      skill: "Backend Architecture",
    },
    {
      id: "ai-fullstack-q77",
      question:
        "A Next.js page contains data that should only be accessible after authentication. Where should sensitive authorization decisions happen?",
      options: ["Server/backend", "CSS", "Browser UI only", "HTML comments"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q78",
      question:
        "A frontend hides an Admin button from normal users, but a user manually calls the admin API endpoint. What should happen?",
      options: ["Backend must independently verify admin authorization", "Request should always succeed", "UI should handle security", "Browser should decide"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q79",
      question:
        "An AI pipeline consists of: Upload → Extract → Embed → Store → Search. Embedding generation fails halfway through. What design helps resume processing?",
      options: ["Track processing state/checkpoints", "Restart everything blindly", "Delete all embeddings", "Ignore the failure"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q80",
      question:
        "A system stores millions of vector embeddings and frequently performs nearest-neighbor searches. Which database capability is useful?",
      options: ["Vector index/search", "Alphabetical sorting", "HTML indexing", "CSS selectors"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q81",
      question:
        "A React app fetches data inside useEffect, but the component unmounts before the request finishes. What can help prevent updating unmounted state?",
      options: ["AbortController/cancellation", "Infinite loop", "Disable React", "Duplicate requests"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q82",
      question:
        "A search API returns results for 'React' and 'react' differently even though the application intends case-insensitive search. What should be considered?",
      options: ["Normalize input consistently", "Add random casing", "Disable search", "Store two copies of every record"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q83",
      question:
        "An AI system frequently hallucinates when asked questions outside its supported domain. Which strategy helps?",
      options: ["Domain constraints and fallback responses", "Increase hallucinations intentionally", "Remove validation", "Increase prompt length indefinitely"],
      correct: 0,
      skill: "AI Engineering",
    },
    {
      id: "ai-fullstack-q84",
      question:
        "A user has a slow network connection and the application downloads a 10 MB JavaScript bundle before showing anything. What can improve initial load?",
      options: ["Code splitting/lazy loading", "Increase bundle size", "Duplicate dependencies", "Disable caching"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q85",
      question:
        "A frontend displays a loading spinner forever when an API fails. What is missing?",
      options: ["Error handling and timeout state", "More animation", "Larger spinner", "More API requests"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q86",
      question:
        "A database query is slow because it retrieves unnecessary records before filtering. What should be optimized first?",
      options: ["Query filtering/indexing", "UI colors", "Browser font", "HTML indentation"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q87",
      question:
        "A backend receives a request to update only a user's phone number. Which HTTP method best represents a partial update?",
      options: ["PATCH", "GET", "DELETE", "OPTIONS"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q88",
      question:
        "A user deletes a resource, but the request is accidentally retried. What property is desirable for the DELETE operation?",
      options: ["Idempotency", "Randomness", "Non-determinism", "Duplication"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q89",
      question:
        "A service stores API credentials in GitHub. What should be done immediately?",
      options: ["Revoke/rotate the exposed credentials", "Rename the repository only", "Hide the commit with CSS", "Ignore it"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q90",
      question:
        "An AI application has increasing inference costs. Which change could reduce cost while maintaining quality?",
      options: ["Cache repeated results and route simple tasks to cheaper models", "Always use the largest model", "Increase prompt size", "Run every request twice"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q91",
      question:
        "A database has: 100 users, 10,000 applications. A dashboard needs each user's application count. Loading every application into the browser is inefficient. What is better?",
      options: ["Database aggregation/count query", "Fetch everything", "Render all applications", "Use CSS counters"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q92",
      question:
        "An AI job matcher scores candidates using: Skills: 50%, Experience: 30%, Education: 20%. A candidate scores 80, 60, and 90 respectively. What is the final score?",
      options: ["74", "76", "78", "80"],
      correct: 1,
      skill: "AI & Logic",
    },
    {
      id: "ai-fullstack-q93",
      question:
        "A user searches 1 million job records using a substring query. A normal B-tree index may not efficiently support arbitrary substring searches such as %React%. What could be more appropriate?",
      options: ["Search engine/full-text indexing", "More CSS", "Stack", "Queue"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q94",
      question:
        "An API returns sensitive database fields that the frontend doesn't need. What is the best practice?",
      options: ["Select/serialize only allowed fields", "Return the entire database record", "Hide fields with CSS", "Send passwords and hide them visually"],
      correct: 0,
      skill: "Backend Security",
    },
    {
      id: "ai-fullstack-q95",
      question:
        "An AI service generates a recommendation, but the recommendation must satisfy a hard business rule: candidates without a required certification cannot be recommended. Where should this rule be enforced?",
      options: ["Deterministic application/business logic", "AI output alone", "CSS", "User browser preference"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q96",
      question:
        "A web application experiences traffic spikes during college placement season. What architecture helps absorb sudden bursts of expensive processing?",
      options: ["Queue + scalable workers", "Synchronous processing for everything", "Remove the database", "Disable caching"],
      correct: 0,
      skill: "Backend Architecture",
    },
    {
      id: "ai-fullstack-q97",
      question:
        "A frontend needs to display AI-generated recommendations while they are being generated. The server supports incremental responses. What technique can improve UX?",
      options: ["Streaming responses", "Wait for all content before showing anything", "Reload repeatedly", "Duplicate requests"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q98",
      question:
        "An AI model has a maximum context size. Sending a document larger than that causes requests to fail. What should be done?",
      options: ["Chunk/summarize the document", "Keep sending the entire document", "Add whitespace", "Duplicate the document"],
      correct: 0,
      skill: "AI Engineering",
    },
    {
      id: "ai-fullstack-q99",
      question:
        "A user enters an extremely complex regular expression into a search field, causing excessive CPU usage. What type of attack may this indicate?",
      options: ["ReDoS", "XSS", "CSRF", "DNS spoofing"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q100",
      question:
        "A logged-in user's browser automatically sends authentication cookies with a malicious cross-site request. Which attack should be considered?",
      options: ["CSRF", "SQL injection", "XSS only", "Buffer overflow"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q101",
      question:
        "A web application uses cookies for authentication. Which cookie attributes improve security?",
      options: ["HttpOnly, Secure, and appropriate SameSite", "Public, Debug, and Open", "NoAuth, Visible, and Unsafe", "None"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q102",
      question:
        "A user repeatedly refreshes an AI dashboard and creates duplicate expensive requests. What can the server use in addition to frontend controls?",
      options: ["Rate limiting/deduplication", "Larger HTML", "More animations", "Disable database indexes"],
      correct: 0,
      skill: "Backend Security",
    },
    {
      id: "ai-fullstack-q103",
      question:
        "A database transaction updates a student's application status and creates a related audit record. Both operations must succeed together. What should be used?",
      options: ["Transaction", "Two unrelated requests", "CSS state", "Browser cache"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q104",
      question:
        "An API performs: Read → Calculate → Write. Another request modifies the same record between the read and write. What problem can occur?",
      options: ["Race condition", "Syntax highlighting", "Compression", "Rendering"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q105",
      question:
        "Two users attempt to reserve the final available seat simultaneously. What backend mechanism can prevent both from successfully claiming it?",
      options: ["Atomic transaction/conditional update", "Frontend button color", "Browser alert", "Random delay only"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q106",
      question:
        "A system needs to maintain an audit trail of who changed an application status and when. What should be stored?",
      options: ["Actor, action, timestamp, and relevant change", "Only UI color", "Browser font", "Screen resolution"],
      correct: 0,
      skill: "Backend Architecture",
    },
    {
      id: "ai-fullstack-q107",
      question:
        "A developer changes a database schema manually in production without recording the change. Later environments become inconsistent. What practice helps?",
      options: ["Database migrations", "Manual undocumented changes", "Delete staging", "Disable version control"],
      correct: 0,
      skill: "DevOps",
    },
    {
      id: "ai-fullstack-q108",
      question:
        "A production bug is fixed directly on the server but not committed to source control. What is the major problem?",
      options: ["The fix cannot be reliably reproduced/deployed", "The website becomes faster", "The database becomes indexed", "AI becomes more accurate"],
      correct: 0,
      skill: "DevOps",
    },
    {
      id: "ai-fullstack-q109",
      question:
        "A CI pipeline should reject code if unit tests fail. What should happen?",
      options: ["Pipeline should fail", "Pipeline should deploy anyway", "Tests should be deleted", "Errors should be ignored"],
      correct: 0,
      skill: "DevOps",
    },
    {
      id: "ai-fullstack-q110",
      question:
        "A developer wants to deploy a new backend version without immediately sending all users to it. Which strategy is useful?",
      options: ["Canary deployment", "Delete old version", "Manual browser refresh", "Disable monitoring"],
      correct: 0,
      skill: "DevOps",
    },
    {
      id: "ai-fullstack-q111",
      question:
        "A frontend uses an environment variable containing a secret but prefixes it with a public/client-exposed prefix. What is the risk?",
      options: ["The secret may be bundled into client-side code", "The variable becomes encrypted", "The server deletes it", "The database automatically protects it"],
      correct: 0,
      skill: "Security",
    },
    {
      id: "ai-fullstack-q112",
      question:
        "An AI system's answers become worse after a prompt change. What is the best engineering response?",
      options: ["Evaluate against a fixed test/evaluation set", "Assume the model is broken", "Delete all tests", "Increase randomness"],
      correct: 0,
      skill: "AI Engineering",
    },
    {
      id: "ai-fullstack-q113",
      question:
        "A recommendation model is updated. Before deploying it to all users, the team wants to compare it against the current model on real traffic. Which strategy is useful?",
      options: ["A/B testing", "Delete the old model", "Randomly switch everyone", "Disable analytics"],
      correct: 0,
      skill: "AI Engineering",
    },
    {
      id: "ai-fullstack-q114",
      question:
        "A user sees recommendations based on another user's profile. What is the likely architectural issue?",
      options: ["Incorrect user scoping/cache key", "CSS error", "Font mismatch", "Image compression"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q115",
      question:
        "A backend endpoint is slow only when the database contains millions of records. What should be investigated first?",
      options: ["Query plan, indexes, filtering, and pagination", "Button color", "Logo size", "Browser theme"],
      correct: 0,
      skill: "Database Engineering",
    },
    {
      id: "ai-fullstack-q116",
      question:
        "A Firestore listener remains active after a component is removed from the page. What can happen?",
      options: ["Memory/resource leak and duplicate listeners", "Faster rendering", "Automatic encryption", "Better indexing"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q117",
      question:
        "In React, a Firestore onSnapshot() listener is created inside useEffect. What should normally happen when the component unmounts?",
      options: ["Unsubscribe from the listener", "Create another listener", "Reload the page", "Keep every listener forever"],
      correct: 0,
      skill: "Frontend Engineering",
    },
    {
      id: "ai-fullstack-q118",
      question:
        "An AI recommendation pipeline has three independent tasks that each take 2 seconds. If executed sequentially, the total is roughly 6 seconds. If they can safely execute in parallel, what is the approximate processing time ignoring overhead?",
      options: ["2 seconds", "4 seconds", "6 seconds", "8 seconds"],
      correct: 0,
      skill: "AI System Design",
    },
    {
      id: "ai-fullstack-q119",
      question:
        "An API has a 10-second timeout, but the external AI service usually responds within 2 seconds. During outages, requests remain open for the full 10 seconds and consume resources. What can help?",
      options: ["Appropriate timeout + cancellation", "Infinite timeout", "Remove error handling", "Retry immediately forever"],
      correct: 0,
      skill: "Backend Engineering",
    },
    {
      id: "ai-fullstack-q120",
      question:
        "A CampusLink application must recommend jobs based on skills, but the company also requires every recommendation to respect eligibility rules such as GPA or year limits. Which design is most appropriate?",
      options: [
        "Deterministic rule filtering combined with AI ranking",
        "Ignore eligibility rules",
        "Let the AI decide everything without constraints",
        "Randomly filter jobs",
      ],
      correct: 0,
      skill: "AI System Design",
    },
  ],
};

export function getQuestionsForRole(role: string): Question[] {
  const normalizedRole = role.trim();

  if (questionBank[normalizedRole]) {
    return questionBank[normalizedRole];
  }

  const fallback = Object.values(
    questionBank
  ).flat();

  return fallback.length
    ? fallback
    : [
        {
          id: "general-q1",
          question:
            "Which approach is generally preferred for independent async operations?",
          options: [
            "Sequential execution",
            "Parallel execution",
            "Avoid async entirely",
            "Use callbacks everywhere",
          ],
          correct: 1,
          skill: "General",
        },
      ];
}
