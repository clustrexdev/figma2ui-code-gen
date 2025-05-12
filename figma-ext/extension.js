const vscode = require('vscode');

const endpoint = "https://1ixtya5o5f.execute-api.ap-south-1.amazonaws.com/v1/stream_response_from_claude";

class ClaudeChatPanel {
    constructor(context) {
        this._context = context;
        this._panel = null;
    }

    show() {
        if (this._panel) {
            this._panel.reveal(vscode.ViewColumn.One);
            return;
        }

        this._panel = vscode.window.createWebviewPanel(
            'claudeChat',
            'Claude Chat',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        this._panel.webview.html = this._getHtmlContent();

        this._panel.webview.onDidReceiveMessage(
            message => this._handleWebviewMessage(message),
            undefined,
            this._context.subscriptions
        );

        this._panel.onDidDispose(
            () => { this._panel = null; },
            null,
            this._context.subscriptions
        );
    }

    _getHtmlContent() {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Claude Chat</title>
            <style>
                :root {
                    --bg-color: #f4f4f4;
                    --text-color: #333;
                    --user-message-bg: #e6f2ff;
                    --claude-message-bg: #e6ffe6;
                    --input-bg: #ffffff;
                    --border-color: #d1d1d1;
                }

                body { 
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    padding: 20px;
                }

                #chat-messages { 
                    flex-grow: 1;
                    overflow-y: auto;
                    background-color: white;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .message {
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 8px;
                    max-width: 80%;
                    word-wrap: break-word;
                }

                .user-message { 
                    align-self: flex-end;
                    background-color: var(--user-message-bg);
                    margin-left: auto;
                    text-align: right;
                }

                .claude-message { 
                    align-self: flex-start;
                    background-color: var(--claude-message-bg);
                    margin-right: auto;
                    text-align: left;
                }

                .input-area {
                    display: flex;
                    gap: 10px;
                }

                #user-input { 
                    flex-grow: 1;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    background-color: var(--input-bg);
                    font-size: 16px;
                }

                #send-button { 
                    padding: 12px 20px;
                    background-color: #4a90e2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.3s ease;
                }

                #send-button:hover {
                    background-color: #357abd;
                }

                .typing-indicator {
                    text-align: center;
                    color: #888;
                    font-style: italic;
                    display: none;
                }

                .error-message {
                    color: red;
                    text-align: center;
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div id="chat-messages"></div>
                <div class="typing-indicator" id="typing-indicator">Claude is typing...</div>
                <div class="input-area">
                    <input type="text" id="user-input" placeholder="Type your message...">
                    <button id="send-button">Send</button>
                </div>
                <div id="error-container" class="error-message"></div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                const chatMessages = document.getElementById('chat-messages');
                const userInput = document.getElementById('user-input');
                const sendButton = document.getElementById('send-button');
                const typingIndicator = document.getElementById('typing-indicator');
                const errorContainer = document.getElementById('error-container');

                sendButton.addEventListener('click', () => sendMessage());
                userInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage();
                });

                function sendMessage() {
                    const message = userInput.value.trim();
                    if (message) {
                        const userMessageEl = document.createElement('div');
                        userMessageEl.textContent = message;
                        userMessageEl.className = 'message user-message';
                        chatMessages.appendChild(userMessageEl);

                        typingIndicator.style.display = 'block';
                        errorContainer.textContent = '';

                        vscode.postMessage({
                            command: 'sendMessage',
                            text: message
                        });

                        userInput.value = '';
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'appendResponse') {
                        typingIndicator.style.display = 'none';

                        const claudeMessageEl = document.getElementById('claude-response') || 
                            document.createElement('div');
                        claudeMessageEl.id = 'claude-response';
                        claudeMessageEl.className = 'message claude-message';
                        claudeMessageEl.textContent = message.text;
                        
                        if (!document.getElementById('claude-response')) {
                            chatMessages.appendChild(claudeMessageEl);
                        }
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    } else if (message.command === 'showError') {
                        typingIndicator.style.display = 'none';
                        errorContainer.textContent = message.text;
                    }
                });
            </script>
        </body>
        </html>
        `;
    }

    _handleWebviewMessage(message) {
        if (message.command === 'sendMessage') {
            this._generateClaudeResponse(message.text);
        }
    }

    async _generateClaudeResponse(prompt) {
        if (!this._panel) return;
    
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: prompt })
            });
    
            // Log the entire raw response for debugging
            const rawResponse = await response.text();
            console.log('Raw API Response:', rawResponse);
    
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${rawResponse}`);
            }
    
            let data;
            try {
                data = JSON.parse(rawResponse);
            } catch (parseError) {
                console.error('JSON Parsing Error:', parseError);
                throw new Error(`Failed to parse response: ${rawResponse}`);
            }
    
            // Direct handling of the response format
            const answer = data.answer || data.body?.answer || 'No answer received.';
    
            this._panel.webview.postMessage({
                command: 'appendResponse',
                text: answer
            });
        } catch (error) {
            console.error('Detailed Error:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
    
            this._panel.webview.postMessage({
                command: 'showError',
                text: `Error: ${error.message}`
            });
        }
    }
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('claude-bedrock.openChat', () => {
        const claudeChatPanel = new ClaudeChatPanel(context);
        claudeChatPanel.show();
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
