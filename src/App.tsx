import { useState, useCallback, useRef } from "react";
import {
  Shield,
  Upload,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Brain,
  Lock,
  TrendingUp,
  Cpu,
  Zap,
  Target,
  X,
} from "lucide-react";
import { analyzeResume, type AnalysisResult } from "./utils/analyzer";
import AnalyzingAnimation from "./components/AnalyzingAnimation";
import Dashboard from "./components/Dashboard";

type AppState = "landing" | "analyzing" | "dashboard";

function App() {
  const [state, setState] = useState<AppState>("landing");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(() => {
    if (!resumeText.trim()) return;
    setState("analyzing");
  }, [resumeText]);

  const handleAnalysisComplete = useCallback(() => {
    const analysisResult = analyzeResume(resumeText);
    setResult(analysisResult);
    setState("dashboard");
    window.scrollTo(0, 0);
  }, [resumeText]);

  const handleReset = useCallback(() => {
    setState("landing");
    setResumeText("");
    setResult(null);
    setFileName("");
    window.scrollTo(0, 0);
  }, []);

  const extractTextFromFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) extractTextFromFile(file);
    },
    [extractTextFromFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) extractTextFromFile(file);
    },
    [extractTextFromFile]
  );

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSample = () => {
    const sampleResume = `John Smith
Senior Software Engineer | Cloud & AI Solutions

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years of expertise in backend development, cloud architecture, and system design. Passionate about building scalable distributed systems and leveraging AI/ML technologies to solve complex problems. Strong leadership and cross-functional collaboration skills.

SKILLS
Programming: Python, Java, Go, TypeScript, JavaScript
Cloud: AWS (EC2, Lambda, S3, DynamoDB, SQS), Azure, Google Cloud Platform (GCP)
DevOps: Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, CI/CD pipelines
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch, Cassandra
Frameworks: Spring Boot, Django, React, Node.js, Express, GraphQL
AI/ML: TensorFlow, PyTorch, Natural Language Processing, Machine Learning fundamentals
Architecture: Microservices, Event-driven architecture, Domain-driven design, CQRS
Security: OAuth2, JWT, Identity management, Security architecture
Monitoring: Prometheus, Grafana, Datadog, ELK Stack

EXPERIENCE
Senior Software Engineer — TechCorp Inc. (2020 – Present)
• Led the design and implementation of a microservices architecture serving 10M+ users
• Built scalable data pipelines using Apache Kafka and Apache Spark
• Implemented CI/CD pipelines reducing deployment time by 70%
• Mentored junior engineers and conducted system design reviews
• Integrated AI-assisted coding tools to improve team productivity

Software Engineer — DataFlow Solutions (2017 – 2020)
• Developed RESTful APIs and GraphQL services using Python and Java
• Managed cloud infrastructure on AWS with Terraform
• Implemented automated testing strategies using pytest and Selenium
• Contributed to data engineering projects involving ETL pipelines

Junior Developer — WebStart Agency (2015 – 2017)
• Built responsive web applications using React and Node.js
• Worked with PostgreSQL and MongoDB databases
• Participated in agile development processes and code reviews

EDUCATION
B.S. Computer Science — State University (2015)

CERTIFICATIONS
• AWS Solutions Architect Associate
• Certified Kubernetes Administrator (CKA)
• Google Cloud Professional Data Engineer

PROJECTS
• Open-source contribution to machine learning libraries
• Built a real-time analytics dashboard with streaming data
• Designed a scalable chat application handling 100K concurrent users`;

    setResumeText(sampleResume);
    setFileName("sample-resume.txt");
  };

  // ─── Analyzing State ──────────────────────────────────────────
  if (state === "analyzing") {
    return <AnalyzingAnimation onComplete={handleAnalysisComplete} />;
  }

  // ─── Dashboard State ─────────────────────────────────────────
  if (state === "dashboard" && result) {
    return <Dashboard result={result} resumeText={resumeText} fileName={fileName} onReset={handleReset} />;
  }

  // ─── Landing State ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-gray-950/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              Path4Career <span className="text-cyan-400">AI Career Shield™</span>
            </span>
          </div>
          <button
            onClick={scrollToUpload}
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Analyze Resume
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">AI-Powered Career Analysis</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
              Is Your Career{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Proof
              </span>
              ?
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              Upload your resume and get an instant{" "}
              <strong className="text-white">AI Career Safety Score</strong>. Discover your strengths,
              vulnerability areas, and a personalized roadmap to stay ahead of automation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={scrollToUpload}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Check Your Score Now
              </button>
              <button
                onClick={loadSample}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-all cursor-pointer"
              >
                Try Sample Resume
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-gray-500">Skills Analyzed</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-gray-500">Risk Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">10+</p>
                <p className="text-xs text-gray-500">Career Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Three simple steps to understand your career's AI resilience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload Resume",
                desc: "Paste your resume text or upload a text file. We analyze your skills, experience, and keywords.",
                color: "from-cyan-500 to-blue-600",
                step: "01",
              },
              {
                icon: Cpu,
                title: "AI Analysis",
                desc: "Our engine evaluates your skills against AI-resistant, AI-vulnerable, and future-proof categories.",
                color: "from-blue-500 to-purple-600",
                step: "02",
              },
              {
                icon: Target,
                title: "Get Your Score",
                desc: "Receive a detailed safety score, personalized recommendations, and a learning roadmap.",
                color: "from-purple-500 to-pink-600",
                step: "03",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white/[0.03] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all group"
              >
                <span className="absolute top-4 right-4 text-5xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">
                  {item.step}
                </span>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-5`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Analyze */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">What We Analyze</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Your resume is evaluated across multiple dimensions of career resilience
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "AI-Resistant Skills",
                items: ["System Design", "Architecture", "Leadership", "Problem Solving", "Product Thinking"],
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
              },
              {
                icon: Brain,
                title: "Future-Proof Skills",
                items: ["AI / ML", "Cloud Computing", "DevOps", "Data Engineering", "Cybersecurity"],
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20",
              },
              {
                icon: TrendingUp,
                title: "General Tech Skills",
                items: ["Backend Dev", "Frontend Dev", "Databases", "Mobile", "Testing & QA"],
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20",
              },
              {
                icon: Zap,
                title: "Vulnerability Check",
                items: ["Repetitive Coding", "Manual Testing", "Data Entry", "Basic Support", "Template Work"],
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
              },
              {
                icon: FileText,
                title: "Resume Quality",
                items: ["ATS Compatibility", "Keyword Density", "Content Length", "Section Coverage"],
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20",
              },
              {
                icon: Lock,
                title: "Career Readiness",
                items: ["Learning Path", "Certifications", "Career Suggestions", "Skill Gaps"],
                color: "text-pink-400",
                bg: "bg-pink-500/10",
                border: "border-pink-500/20",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`${card.bg} border ${card.border} rounded-2xl p-6 hover:scale-[1.02] transition-all`}
              >
                <card.icon className={`w-8 h-8 ${card.color} mb-4`} />
                <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                <ul className="space-y-1.5">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Explanation */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Score Interpretation</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Understanding what your AI Career Safety Score means
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                range: "7 – 10",
                label: "AI Safe Zone",
                icon: ShieldCheck,
                color: "from-emerald-500 to-green-600",
                border: "border-emerald-500/20",
                bg: "bg-emerald-500/5",
                desc: "Your profile shows strong resilience against automation trends. AI tools will likely assist you rather than replace you.",
                tips: ["Continue upgrading skills", "Learn AI tools", "Move towards architecture roles"],
              },
              {
                range: "4 – 6",
                label: "Moderate Risk",
                icon: Shield,
                color: "from-amber-500 to-orange-600",
                border: "border-amber-500/20",
                bg: "bg-amber-500/5",
                desc: "Some of your skills may become automated. Upgrading your technical stack and learning AI-assisted development is recommended.",
                tips: ["Add cloud technologies", "Learn AI-assisted coding", "Improve system design"],
              },
              {
                range: "0 – 3",
                label: "High Risk",
                icon: ShieldCheck,
                color: "from-red-500 to-rose-600",
                border: "border-red-500/20",
                bg: "bg-red-500/5",
                desc: "Your resume indicates skills that may be significantly impacted by automation. Consider reskilling into high-demand technologies.",
                tips: ["Learn data analytics", "Start AI/ML basics", "Explore DevOps & Cybersecurity"],
              },
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`${tier.bg} border ${tier.border} rounded-2xl p-8 transition-all hover:scale-[1.02]`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${tier.color} flex items-center justify-center mb-5`}>
                  <tier.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-mono text-gray-500 mb-1">Score {tier.range}</div>
                <h3 className="text-xl font-bold text-white mb-3">{tier.label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{tier.desc}</p>
                <ul className="space-y-2">
                  {tier.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section ref={uploadSectionRef} className="py-20 border-t border-white/5" id="upload">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Free Career Analysis</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Analyze Your Resume</h2>
            <p className="text-gray-400">
              Paste your resume content below or upload a text file to get started
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8">
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${
                dragActive
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.csv"
                onChange={handleFileInput}
                className="hidden"
              />
              <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? "text-cyan-400" : "text-gray-600"}`} />
              <p className="text-sm text-gray-400">
                <span className="text-cyan-400 font-medium">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-600 mt-1">Supports .txt, .md files</p>
              {fileName && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">{fileName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileName("");
                      setResumeText("");
                    }}
                    className="ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3 text-gray-400 hover:text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Textarea */}
            <div className="relative mb-6">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume text here...&#10;&#10;Include your skills, experience, education, certifications, and projects for the most accurate analysis."
                className="w-full h-56 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
              {resumeText && (
                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                  {resumeText.split(/\s+/).filter(Boolean).length} words
                </div>
              )}
            </div>

            {/* Sample + Analyze button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!resumeText.trim()}
                className={`w-full sm:flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  resumeText.trim()
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                <Shield className="w-5 h-5" />
                Analyze My Career Safety
              </button>
              <button
                onClick={loadSample}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10 transition-all cursor-pointer text-sm"
              >
                Load Sample
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-3 h-3 text-gray-600" />
              <p className="text-xs text-gray-600">
                Your resume data is processed locally in your browser. We don't store or send your data anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-400">
              Path4Career <span className="text-cyan-400">AI Career Shield™</span>
            </span>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Path4Career. Career guidance powered by intelligent analysis.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
