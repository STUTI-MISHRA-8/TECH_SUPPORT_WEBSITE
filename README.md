# AI-Powered Tech Support Prototype

A local, AI-driven tech support platform leveraging Ollama and Llama2 to provide automated solutions to technical issues. This project prioritizes data privacy and offers a foundation for a more comprehensive support system.

## Overview

This project simulates a tech support website where users can submit technical problems and receive AI-generated solutions. It utilizes a modern web stack combined with local Large Language Model (LLM) inference for enhanced security and offline functionality.

## Key Features

*   **User Authentication:** Basic signup and login functionality.
*   **Issue Submission:** Users can describe their technical problems in a text area.
*   **AI-Powered Solutions:** The system generates solutions using the Llama2 LLM through Ollama.
*   **Real-Time Display:** Solutions are streamed to the user interface using Server-Sent Events (SSE).
*   **Issue Escalation:** Users can forward unsolved issues to a "Systems" team.
*   **Unsolved Issue Management:**  Administrators can view and manage a list of unsolved issues.

## Tech Stack

*   **Frontend:** HTML, CSS, JavaScript (ES6+)
*   **Backend:** Python, Flask
*   **AI Inference:** Ollama (running Llama2)
*   **Data Storage:** Excel file (for demonstration purposes only)

## Setup and Installation

1.  **Prerequisites:**
    *   [Python 3.7+](https://www.python.org/downloads/) installed
    *   [Ollama](https://ollama.ai/) installed and configured.
    *   Llama2 model downloaded in Ollama (`ollama run llama2`)
    *   [Git](https://git-scm.com/downloads) installed

2.  **Clone the repository:**

    ```bash
    git clone [Your repository URL, you'll get this after creating the repo]
    cd [your-project-name]
    ```

3.  **Create a virtual environment (recommended):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```

4.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```
    *(You'll need to create a `requirements.txt` file; see below)*

5.  **Run the Flask server:**

    ```bash
    python server.py
    ```

    (Make sure Ollama is running in the background!)

6.  **Open the `index.html` file in your browser.**

## Usage

1.  Sign up or log in to the website.
2.  Describe your technical issue in the text area.
3.  Click "Get Solution" to receive an AI-generated solution.
4.  Mark the issue as solved or forward it to the Systems team.

