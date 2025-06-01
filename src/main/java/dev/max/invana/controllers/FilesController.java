package dev.max.invana.controllers;

import dev.max.invana.entities.AgentSettings;
import dev.max.invana.services.AgentSettingsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class FilesController {

    private AgentSettingsService agentSettingsService;

    @GetMapping(value = "/scripts/install.sh", produces = "text/x-shellscript")
    public ResponseEntity<String> getInstallScript() {
        AgentSettings settings = agentSettingsService.getSettings();
        String serverUrl = settings.getServerUrl();
        int serverPort = settings.getServerPort();

        String installScript = """
            #!/bin/bash

            set -e

            # === Parse CLI arguments ===
            for arg in "$@"; do
              case $arg in
                --token=*)
                  TOKEN="${arg#*=}"
                  shift
                  ;;
                --serverUrl=*)
                  SERVER_URL="${arg#*=}"
                  shift
                  ;;
                --serverPort=*)
                  SERVER_PORT="${arg#*=}"
                  shift
                  ;;
                *)
                  echo "Unknown argument: $arg"
                  exit 1
                  ;;
              esac
            done

            if [ -z "$TOKEN" ]; then
              echo "Usage: install.sh --token=<YOUR_AGENT_TOKEN> [--serverUrl=<URL>] [--serverPort=<PORT>]"
              exit 1
            fi

            INSTALL_DIR="/opt/invana-agent"
            ZIP_URL="%s:%d/invana-agent.zip"
            CONFIG_FILE="$INSTALL_DIR/config.json"
            PYTHON_BIN=$(which python3 || true)

            echo ">> Installing invana Agent..."

            if [ -z "$PYTHON_BIN" ]; then
              echo ">> Installing Python 3..."
              apt-get update
              apt-get install -y python3 python3-pip
              PYTHON_BIN=$(which python3)
            fi

            echo ">> Creating installation directory at $INSTALL_DIR"
            rm -rf "$INSTALL_DIR"
            mkdir -p "$INSTALL_DIR"

            echo ">> Downloading agent from $ZIP_URL"
            curl -sSL "$ZIP_URL" -o /tmp/invana-agent.zip

            if ! file /tmp/invana-agent.zip | grep -q 'Zip archive data'; then
              echo ">> ERROR: Downloaded file is not a valid zip archive."
              exit 1
            fi

            echo ">> Extracting agent..."
            unzip -q /tmp/invana-agent.zip -d "$INSTALL_DIR"
            rm /tmp/invana-agent.zip

            echo ">> Creating Python virtual environment..."
            python3 -m venv "$INSTALL_DIR/venv"

            echo ">> Activating virtual environment..."
            source "$INSTALL_DIR/venv/bin/activate"

            echo ">> Installing Python dependencies..."
            "$INSTALL_DIR/venv/bin/pip" install --upgrade pip
            "$INSTALL_DIR/venv/bin/pip" install -r "$INSTALL_DIR/requirements.txt"

            echo ">> Writing configuration to config.json"

            cat <<EOF > "$CONFIG_FILE"
            {
              "token": "$TOKEN",
              "serverUrl": "${SERVER_URL:-http://localhost}",
              "serverPort": "${SERVER_PORT:-8080}"
            }
            EOF

            echo ">> Setting up systemd service..."
            cat <<EOF > /etc/systemd/system/invana-agent.service
            [Unit]
            Description=invana Agent
            After=network.target

            [Service]
            ExecStart=$INSTALL_DIR/venv/bin/python $INSTALL_DIR/agent.py
            WorkingDirectory=$INSTALL_DIR
            Restart=always
            User=root

            [Install]
            WantedBy=multi-user.target
            EOF

            systemctl daemon-reexec
            systemctl daemon-reload
            systemctl enable invana-agent
            systemctl start invana-agent

            echo ">> invana Agent installed successfully."
            """.formatted(serverUrl, serverPort);

        return ResponseEntity.ok(installScript);
    }

}
