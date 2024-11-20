import requests
import subprocess
import webbrowser
import time

# Configuration
SERVER_URL = "http://localhost:3000"
START_COMMAND = "npm start"  # Command to start your server
BROWSER_WAIT_TIME = 3        # Time to wait before opening the browser (in seconds)

# Function to check if the server is running
def is_server_running():
    try:
        response = requests.get(SERVER_URL)
        return response.status_code == 200
    except requests.ConnectionError:
        return False

# Function to start the server
def start_server():
    print("Starting the server...")
    server_process = subprocess.Popen(START_COMMAND, shell=True)
    time.sleep(BROWSER_WAIT_TIME)  # Wait for the server to start
    return server_process

# Function to open the browser
def open_browser():
    print(f"Opening {SERVER_URL} in the browser...")
    webbrowser.open(SERVER_URL)

# Main logic
def main():
    if is_server_running():
        print("Server is already running.")
        open_browser()
    else:
        print("Server is not running.")
        server_process = start_server()
        if is_server_running():
            print("Server started successfully.")
            open_browser()
        else:
            print("Failed to start the server.")

if __name__ == "__main__":
    main()
