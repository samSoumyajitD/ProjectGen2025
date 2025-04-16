import React from "react";
import Chatbot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import axios from "axios";

const theme = {
  background: "#f5f8fb",
  headerBgColor: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor:
    "linear-gradient(135deg, #9446E5 0%, #7E4FDD 50%, #5B61F4 100%)",
  botFontColor: "#fff",
  userBubbleColor: "rgba(148, 70, 229, 0.1)",
  userFontColor: "#4a4a4a",
};

const vsCodeTheme = {
  keyword: "#c586c0",
  string: "#ce9178",
  comment: "#6a9955",
  function: "#dcdcaa",
  variable: "#9cdcfe",
  background: "#1e1e1e",
  text: "#d4d4d4",
};

const CodeLine = ({ line }) => {
  const styles = {
    default: { color: vsCodeTheme.text },
    keyword: { color: vsCodeTheme.keyword },
    string: { color: vsCodeTheme.string },
    comment: { color: vsCodeTheme.comment },
    function: { color: vsCodeTheme.function },
    variable: { color: vsCodeTheme.variable },
  };

  let lineStyle = styles.default;
  let content = line;

  // Enhanced regex patterns
  if (/^[\s]*(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/.test(line)) {
    lineStyle = styles.comment;
  } else if (
    /\b(import|from|def|return|if|else|for|while|class|try|except|async|await|lambda|const|let|var|function)\b/.test(
      line
    )
  ) {
    lineStyle = styles.keyword;
  } else if (/(["'`].*?["'`])/.test(line)) {
    lineStyle = styles.string;
  } else if (/(\w+)\s*\(/.test(line)) {
    content = line.replace(/(\w+)(?=\s*\()/g, "<function>$1</function>");
  } else if (/=/.test(line)) {
    content = line.replace(/(\w+)\s*=/g, "<variable>$1</variable>");
  }

  return (
    <div style={lineStyle}>
      {content
        .split(/(<function>.*?<\/function>|<variable>.*?<\/variable>)/g)
        .map((part, i) => {
          if (part.startsWith("<function>")) {
            return (
              <span key={i} style={styles.function}>
                {part.replace(/<\/?function>/g, "")}
              </span>
            );
          }
          if (part.startsWith("<variable>")) {
            return (
              <span key={i} style={styles.variable}>
                {part.replace(/<\/?variable>/g, "")}
              </span>
            );
          }
          return part;
        })}
    </div>
  );
};

const CodeBlock = ({ code, onExpand }) => (
  <div
    style={{
      position: "relative",
      background: vsCodeTheme.background,
      borderRadius: "6px",
      margin: "12px 0",
      border: "1px solid #404040",
    }}
  >
    <button
      onClick={() => onExpand(code)}
      style={{
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "rgba(255, 255, 255, 0.1)",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        color: "#fff",
        fontSize: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        zIndex: 2,
      }}
    >
      <span style={{ opacity: 0.7 }}>&lt;/&gt;</span>
      <span>Expand</span>
    </button>

    <pre
      style={{
        padding: "32px 12px 12px 12px",
        overflowX: "auto",
        fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
        fontSize: "14px",
        lineHeight: "1.5",
        margin: 0,
      }}
    >
      {code.split("\n").map((line, i) => (
        <div key={i} style={{ display: "flex" }}>
          <span
            style={{
              color: "#569cd6",
              userSelect: "none",
              marginRight: "16px",
            }}
          >
            {i + 1}
          </span>
          <CodeLine line={line} />
        </div>
      ))}
    </pre>
  </div>
);

const formatMessage = (text, onExpand) => {
  // Remove this splitting logic that was causing duplicates
  const parts = text.split("```");
  return (
    <div style={{ padding: "10px" }}>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <CodeBlock key={index} code={part.trim()} onExpand={onExpand} className='drak:text-white'/>
          );
        }

        return part
          .split("\n")
          .map((line, sectionIdx) => {
            if (line.trim().startsWith("*")) {
              return (
                <li
                  key={`${index}-${sectionIdx}`}
                  style={{
                    marginLeft: "20px",
                    marginBottom: "5px",
                    lineHeight: "1.4",
                  }}
                >
                  {line.trim().substring(1)} {/* Remove the asterisk */}
                </li>
              );
            }

            if (line.trim()) {
              return (
                <p
                  key={`${index}-${sectionIdx}`}
                  style={{
                    marginBottom: "10px",
                    lineHeight: "1.4",
                  }}
                >
                  {line.trim()}
                </p>
              );
            }
            return null;
          })
          .filter(Boolean);
      })}
    </div>
  );
};

const CustomMessage = ({ previousStep, onExpand }) => {
  const [response, setResponse] = React.useState("Loading...");
  const responseCache = React.useRef(new Map());

  React.useEffect(() => {
    const getMessage = async () => {
      if (responseCache.current.has(previousStep.value)) {
        setResponse(responseCache.current.get(previousStep.value));
        return;
      }

      try {
        const result = await axios.post("http://localhost:5000/api/chat", {
          message: previousStep.value,
        });

        // Extract only the main response before any definitions or explanations
        let cleanResponse = result.data.reply;
        const definitionIndex = cleanResponse.indexOf("*Meaning");
        const explanationIndex = cleanResponse.indexOf("*Explanation");
        const undefinedIndex = cleanResponse.indexOf("*Undefined");

        // Find the first occurrence of any secondary content
        const cutoffIndex = [definitionIndex, explanationIndex, undefinedIndex]
          .filter((index) => index !== -1)
          .reduce((min, current) => Math.min(min, current), Infinity);

        if (cutoffIndex !== Infinity) {
          cleanResponse = cleanResponse.substring(0, cutoffIndex).trim();
        }

        responseCache.current.set(previousStep.value, cleanResponse);
        setResponse(cleanResponse);
      } catch (error) {
        setResponse("Sorry, I'm having trouble connecting to the server.");
      }
    };
    getMessage();
  }, [previousStep]);

  return formatMessage(response, onExpand);
};

const CodeModal = ({ code, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: vsCodeTheme.background,
        borderRadius: "8px",
        width: "80%",
        maxWidth: "800px",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px",
          background: "#1e1e1e",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${vsCodeTheme.comment}`,
        }}
      >
        <span
          style={{
            color: vsCodeTheme.text,
            fontSize: "14px",
            fontFamily: "Consolas, monospace",
          }}
        >
          Code Viewer
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: vsCodeTheme.text,
            cursor: "pointer",
            padding: "4px 8px",
            fontSize: "16px",
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          fontFamily: "Consolas, monospace",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <pre
          style={{
            margin: 0,
            color: vsCodeTheme.text,
          }}
        >
          {code.split("\n").map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              <span
                style={{
                  color: "#569cd6",
                  userSelect: "none",
                  marginRight: "16px",
                  minWidth: "40px",
                }}
              >
                {i + 1}
              </span>
              <CodeLine line={line} />
            </div>
          ))}
        </pre>
      </div>
    </div>
  </div>
);

const CustomChatbot = ({ opened, setOpened, headerTitle = "AI Tutor", initialMessage = "Hello! I am your AI tutor. How can I help you today?" }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedCode, setSelectedCode] = React.useState("");
  
    const handleCodeExpand = (code) => {
      setSelectedCode(code);
      setIsModalOpen(true);
    };
  
    const steps = [
      {
        id: "1",
        message: initialMessage,
        trigger: "userInput",
      },
      {
        id: "userInput",
        user: true,
        trigger: "botResponse",
      },
      {
        id: "botResponse",
        component: <CustomMessage onExpand={handleCodeExpand} />,
        asMessage: true,
        trigger: "userInput",
      },
    ];
  
    return (
      <ThemeProvider theme={theme}>
        <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
          <Chatbot
            steps={steps}
            headerTitle={headerTitle}
            floating={true}
            enableMobileAutoFocus={true}
            bubbleOptionStyle={{ fontSize: "14px", padding: "8px 12px" }}
            bubbleStyle={{ maxWidth: "80%", padding: "8px 12px" }}
            opened={opened}
            toggleFloating={({ opened }) => setOpened(opened)}
          />
  
          {isModalOpen && (
            <CodeModal
              code={selectedCode}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedCode("");
              }}
            />
          )}
        </div>
      </ThemeProvider>
    );
  };
  
export default CustomChatbot;