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
                  echo "  [✗] Unknown argument: $arg"
                  exit 1
                  ;;
              esac
            done
            
            # === Validate required arguments ===
            if [ -z "$TOKEN" ]; then
              echo "  [✗] Missing required argument: --token"
              echo "  [i] Usage: install.sh --token=<YOUR_AGENT_TOKEN> [--serverUrl=<URL>] [--serverPort=<PORT>]"
              exit 1
            fi
            
            # === Variables ===
            INSTALL_DIR="/opt/invana-agent"
            ZIP_URL="%s:%d/invana-agent.zip"
            CONFIG_FILE="$INSTALL_DIR/config.json"
            PYTHON_BIN=$(which python3 || true)
            
            echo "  [✓] Starting invana Agent installation"
            
            # === Ensure Python 3 is installed ===
            if [ -z "$PYTHON_BIN" ]; then
              echo "  [i] Python 3 not found, installing..."
              apt-get update
              apt-get install -y python3 python3-pip
              PYTHON_BIN=$(which python3)
              echo "  [✓] Python 3 installed"
            else
              echo "  [✓] Python 3 found: $PYTHON_BIN"
            fi
            
            # === Create install directory ===
            echo "  [i] Preparing installation directory..."
            rm -rf "$INSTALL_DIR"
            mkdir -p "$INSTALL_DIR"
            echo "  [✓] Installation directory ready at $INSTALL_DIR"
            
            # === Download and extract agent ===
            echo "  [i] Downloading invana Agent from $ZIP_URL"
            curl -sSL "$ZIP_URL" -o /tmp/invana-agent.zip
            
            if ! file /tmp/invana-agent.zip | grep -q 'Zip archive data'; then
              echo "  [✗] Downloaded file is not a valid zip archive."
              exit 1
            fi
            echo "  [✓] Agent archive downloaded"
            
            echo "  [i] Extracting agent files..."
            unzip -q /tmp/invana-agent.zip -d "$INSTALL_DIR"
            rm /tmp/invana-agent.zip
            echo "  [✓] Agent files extracted"
            
            # === Install Python dependencies ===
            echo "  [i] Setting up Python virtual environment..."
            python3 -m venv "$INSTALL_DIR/venv"
            echo "  [✓] Virtual environment created"
            
            echo "  [i] Activating virtual environment..."
            source "$INSTALL_DIR/venv/bin/activate"
            
            echo "  [i] Installing dependencies..."
            "$INSTALL_DIR/venv/bin/pip" install --upgrade pip > /dev/null
            "$INSTALL_DIR/venv/bin/pip" install -r "$INSTALL_DIR/requirements.txt" > /dev/null
            echo "  [✓] Dependencies installed"
            
            # === Write config.json ===
            echo "  [i] Writing configuration to $CONFIG_FILE"
            cat <<EOF > "$CONFIG_FILE"
            {
              "token": "$TOKEN",
              "serverUrl": "${SERVER_URL:-http://localhost}",
              "serverPort": "${SERVER_PORT:-8080}"
            }
            EOF
            echo "  [✓] Configuration written"
            
            # === Set up systemd service ===
            echo "  [i] Setting up systemd service for invana Agent..."
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
            systemctl enable invana-agent > /dev/null
            systemctl start invana-agent
            echo "  [✓] Systemd service installed and started"
            
            echo ""
            echo "  [✓] invana Agent installation complete!"
            echo "  [i] To check service status: systemctl status invana-agent"
            """.formatted(serverUrl, serverPort);

        return ResponseEntity.ok(installScript);
    }

}
