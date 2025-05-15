let isProcessingMessage = false;
let currentMessageContainer = null;

async function callClaudeAPI(question, files = []) {
  try {
      showTypingIndicator();

      const endpoint = "https://1ixtya5o5f.execute-api.ap-south-1.amazonaws.com/v1/stream_response_from_claude";

      const payload = {
          question
          // files: files.map(file => ({ name: file.name, content: file.base64Data }))
      };

      const response = await fetch(endpoint, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseText = await response.text();

      let responseData;
      try {
          responseData = JSON.parse(responseText);

          if (responseData && responseData.answer) {
              removeTypingIndicator();
              addMessage("assistant", responseData.answer);
              return responseData.answer;
          } else {
              console.error("Unexpected response structure:", responseData);
              removeTypingIndicator();
              addMessage("assistant", "Sorry, I received an unexpected response format.");
              return "Sorry, I received an unexpected response format.";
          }
      } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          removeTypingIndicator();
          addMessage("assistant", responseText);
          return responseText;
      }

  } catch (error) {
      console.error("Error calling Claude API:", error);
      removeTypingIndicator();
      addMessage("assistant", "Sorry, I encountered an error: " + (error.message || "Unknown error"));
      throw new Error(error.message || "Error calling Claude API");
  } finally {
      isProcessingMessage = false;
  }
}

// which will then make the actual API call to Claude
function streamResponse(question) {
    callClaudeAPI(question);
    console.log("Request sent to API...");
}

// Auto-resize textarea
const textarea = document.getElementById('userInput');
textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
  // Limit to 5 rows max
  if (this.scrollHeight > 150) {
    this.style.height = '150px';
    this.style.overflowY = 'auto';
  } else {
    this.style.overflowY = 'hidden';
  }
});

// Modal Handling
const settingsModal = document.getElementById('settingsModal');
const uploadModal = document.getElementById('uploadModal');
const mobileMenu = document.getElementById('mobileMenu');

document.getElementById('settingsBtn').addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
  gsap.fromTo(settingsModal.children[0], {scale: 0.9, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3});
});

document.getElementById('mobileSettingsBtn').addEventListener('click', () => {
  mobileMenu.classList.add('-translate-x-full');
  setTimeout(() => {
    settingsModal.classList.remove('hidden');
    gsap.fromTo(settingsModal.children[0], {scale: 0.9, opacity: 0}, {scale: 1, opacity: 1, duration: 0.3});
  }, 300);
});

document.getElementById('closeSettingsBtn').addEventListener('click', () => {
  gsap.to(settingsModal.children[0], {
    scale: 0.9, 
    opacity: 0, 
    duration: 0.2,
    onComplete: () => settingsModal.classList.add('hidden')
  });
});

document.getElementById('uploadBtn').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('closeUploadBtn').addEventListener('click', () => {
  gsap.to(uploadModal.children[0], {
    scale: 0.9, 
    opacity: 0, 
    duration: 0.2,
    onComplete: () => uploadModal.classList.add('hidden')
  });
});

// Mobile menu handling
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  mobileMenu.classList.remove('-translate-x-full');
});

document.getElementById('closeMobileMenuBtn').addEventListener('click', () => {
  mobileMenu.classList.add('-translate-x-full');
});

// Enhanced File Upload Handling
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');
let uploadedFiles = []; // Store file references

fileInput.addEventListener('change', () => {
  // Clear preview if needed
  if (!uploadPreview.classList.contains('hidden')) {
    uploadPreview.innerHTML = '';
  }
  uploadPreview.classList.remove('hidden');
  
  Array.from(fileInput.files).forEach(file => {
    // Add file to our tracking array
    uploadedFiles.push(file);
    
    // Read file content to send to extension later
    const reader = new FileReader();
    reader.onload = (e) => {
      // Save the base64 data with the file object
      file.base64Data = e.target.result.split(',')[1]; // Remove the data:mime/type;base64, prefix
    };
    reader.readAsDataURL(file);
    
    // Create preview element
    const fileItem = document.createElement('div');
    fileItem.className = 'bg-dark-green rounded-lg p-2 flex items-center justify-between mb-2';
    
    // File info section
    const fileInfoDiv = document.createElement('div');
    fileInfoDiv.className = 'flex items-center';
    
    // File icon based on type
    const fileIcon = document.createElement('div');
    fileIcon.className = 'mr-2';
    
    // Determine icon based on file type
    if (file.type.startsWith('image/')) {
      fileIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
    } else if (file.type === 'application/pdf') {
      fileIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
    } else {
      fileIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
    }
    
    const fileName = document.createElement('span');
    fileName.className = 'text-sm truncate max-w-xs';
    fileName.textContent = file.name;
    
    fileInfoDiv.appendChild(fileIcon);
    fileInfoDiv.appendChild(fileName);
    
    // File size
    const fileSize = document.createElement('span');
    fileSize.className = 'text-xs text-gray-400 ml-2';
    fileSize.textContent = formatFileSize(file.size);
    
    // Remove button 
    const removeBtn = document.createElement('button');
    removeBtn.className = 'ml-2 text-gray-400 hover:text-white';
    removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
    
    fileItem.appendChild(fileInfoDiv);
    fileItem.appendChild(fileSize);
    fileItem.appendChild(removeBtn);
    uploadPreview.appendChild(fileItem);
    
    removeBtn.addEventListener('click', () => {
      // Remove from UI
      uploadPreview.removeChild(fileItem);
      
      // Remove from tracking array
      const fileIndex = uploadedFiles.indexOf(file);
      if (fileIndex > -1) {
        uploadedFiles.splice(fileIndex, 1);
      }
      
      // Hide container if empty
      if (uploadPreview.children.length === 0) {
        uploadPreview.classList.add('hidden');
      }
    });
  });
  
  // Reset file input to allow selecting the same file again
  fileInput.value = '';
});

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Enhanced Message Handling & Claude Integration
document.getElementById('sendBtn').addEventListener('click', sendMessage);
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
    // Don't allow sending if already processing
    if (isProcessingMessage) return;
    
    const message = textarea.value.trim();
    if (!message) return;
    
    isProcessingMessage = true;
    
    // Add user message to chat
    addMessage('user', message);
    
    // Clear input
    textarea.value = '';
    textarea.style.height = 'auto';
            
    try {
        // Send to Claude API directly
        await callClaudeAPI(message, uploadedFiles);
    } catch (error) {
        console.error("Error sending message:", error);
        isProcessingMessage = false;
    }
}

function addMessage(sender, content) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message mb-6 last:mb-0';
  
  // Create header with avatar and name
  const header = document.createElement('div');
  header.className = 'flex items-center mb-1';
  
  const userHtml = `
    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    <span class="font-semibold">You</span>
  `;
  
  const systemHtml = `
    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    </div>
    <span class="font-semibold">Fig2UI Assistant</span>
  `;
  
  if (sender === 'user') {
    header.innerHTML = userHtml;
  } else {
    header.innerHTML = systemHtml;
  }
  
  // Create content div
  const contentDiv = document.createElement('div');
  contentDiv.className = 'pl-10 prose prose-sm max-w-none';
  
  // Format the content - apply markdown if it's from the assistant
  if (sender === 'assistant') {
    // Use a library like marked.js for proper markdown rendering
    // For now, we'll just add the text directly
    contentDiv.innerHTML = formatMarkdown(content);
  } else {
    // For user messages, simple text formatting (preserve line breaks)
    contentDiv.innerText = content;
  }
  
  // Add uploaded files if this is a user message and there are files
  if (sender === 'user' && uploadedFiles.length > 0) {
    const filesPreview = document.createElement('div');
    filesPreview.className = 'mt-2 flex flex-wrap gap-2';
    
    uploadedFiles.forEach(file => {
      const fileChip = document.createElement('div');
      fileChip.className = 'bg-dark-green rounded-lg px-3 py-1 text-xs flex items-center';
      
      // Simple icon for files
      let iconHtml = '';
      if (file.type.startsWith('image/')) {
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
      } else {
        iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>';
      }
      
      fileChip.innerHTML = iconHtml + file.name;
      filesPreview.appendChild(fileChip);
    });
    
    contentDiv.appendChild(filesPreview);
    
    // Clear the uploaded files array after adding them to a message
    uploadedFiles = [];
    uploadPreview.innerHTML = '';
    uploadPreview.classList.add('hidden');
  }
  
  // Assemble the message
  messageDiv.appendChild(header);
  messageDiv.appendChild(contentDiv);
  
  // Add to chat container
  chatContainer.appendChild(messageDiv);
  
  // Store reference to current message container if it's from assistant
  // (for streaming updates)
  if (sender === 'assistant') {
    currentMessageContainer = contentDiv;
  }
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Simple markdown formatter (you might want to use a library like marked.js for production)
function formatMarkdown(text) {
    return marked.parse(text);
}

// Typing indicator
function showTypingIndicator() {
  const chatContainer = document.getElementById('chatContainer');
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typingIndicator';
  typingDiv.className = 'chat-message mb-6';
  
  // Create header with avatar and name
  const header = document.createElement('div');
  header.className = 'flex items-center mb-1';
  
  header.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    </div>
    <span class="font-semibold">Fig2UI Assistant</span>
  `;
  
  // Create typing animation
  const typingAnimation = document.createElement('div');
  typingAnimation.className = 'pl-10 flex space-x-1';
  typingAnimation.innerHTML = `
    <div class="dot-typing"></div>
  `;
  
  // Add style for dot-typing if not already in your CSS
  if (!document.getElementById('typing-style')) {
    const style = document.createElement('style');
    style.id = 'typing-style';
    style.innerHTML = `
      .dot-typing {
        position: relative;
        left: -9999px;
        width: 6px;
        height: 6px;
        border-radius: 5px;
        background-color: #9880ff;
        color: #9880ff;
        box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        animation: dotTyping 1.5s infinite linear;
      }
      
      @keyframes dotTyping {
        0% {
          box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        }
        16.667% {
          box-shadow: 9984px -10px 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        }
        33.333% {
          box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        }
        50% {
          box-shadow: 9984px 0 0 0 #9880ff, 9999px -10px 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        }
        66.667% {
          box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        }
        83.333% {
          box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px -10px 0 0 #9880ff;
        }
        100% {
          box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  typingDiv.appendChild(header);
  typingDiv.appendChild(typingAnimation);
  
  chatContainer.appendChild(typingDiv);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Function to handle streaming responses (in case you implement SSE or WebSockets later)
function updateStreamingResponse(text) {
  if (currentMessageContainer) {
    currentMessageContainer.innerHTML = formatMarkdown(text);
    
    // Scroll to bottom
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

// Clear chat
document.getElementById('clearChatBtn').addEventListener('click', () => {
  const chatContainer = document.getElementById('chatContainer');
  // Add confirmation if needed
  chatContainer.innerHTML = '';
  
  // Add welcome message if you want
  addMessage('assistant', 'Hello! I\'m your Fig2UI Assistant. How can I help you today?');
});


window.addEventListener('DOMContentLoaded', () => {
// Add welcome message
    addMessage('assistant', 'Hello! I\'m your Fig2UI Assistant. How can I help you turn your ideas into UI designs?');
});

// Add this for debugging purposes
console.log("Fig2UI Web version loaded successfully");