import requests
import sys
from shutil import which
import subprocess


def get_latest_vsix(repo: str):
    url = f"https://api.github.com/repos/{repo}/releases/latest"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    for asset in data["assets"]:
        if asset["name"].endswith(".vsix"):
            return asset["browser_download_url"]
    raise ValueError("No .vsix file found in latest release")


def download_vsix(repo: str):
    url = get_latest_vsix(repo)
    response = requests.get(url)
    response.raise_for_status()
    url_asset_name = url.split("/")[-1]
    with open(url_asset_name, "wb") as f:
        f.write(response.content)
        print(f"Downloaded {url_asset_name}")
    # Install the extension
    print("Installing extension...")
    code_binary_args = [which("code")]
    if not code_binary_args[0]:
        print("Please install Visual Studio Code to PATH")
        sys.exit(1)
    else:
        # run install_cmd and print stdout
        subprocess.run(
            code_binary_args + ["--install-extension", url_asset_name],
            check=True,
            stdout=subprocess.PIPE,
        )
        print(f"Installed {url_asset_name}")


if sys.argv[1] == "install":
    if len(sys.argv) < 3:
        print("Usage: install.py install <repo>...")
        sys.exit(1)
    # For each arg, download_visx for the repo
    for repo in sys.argv[2:]:
        download_vsix(f"docker/{repo}")
    sys.exit(0)

elif sys.argv[1] == "check-code":
    # Check `code` command is available
    if not which("code"):
        print("Please install Visual Studio Code to PATH")
        sys.exit(1)
    else:
        print("code command exists")
        sys.exit(0)

elif sys.argv[1] == "list-extensions":
    if not which("code"):
        print("Please install Visual Studio Code to PATH")
        sys.exit(1)
    else:
        out = subprocess.run(
            [which("code"), "--list-extensions", "--show-versions"],
            check=True,
            stderr=subprocess.PIPE,
            stdout=subprocess.PIPE,
        )
        sys.exit(out.returncode)

elif sys.argv[1] == "uninstall":
    if len(sys.argv) < 3:
        print("Usage: install.py uninstall <extension_id>...")
        sys.exit(1)
    # For each arg, download_visx for the repo
    for extension_id in sys.argv[2:]:
        # Uninstall the extension
        print("Uninstalling extension...")
        code_cmd_args = [which("code")]
        if not code_cmd_args[0]:
            print("Please install Visual Studio Code to PATH")
            sys.exit(1)
        else:
            # run install_cmd and print stdout
            try:
                subprocess.run(
                    code_cmd_args + ["--uninstall-extension", extension_id],
                    check=True,
                    stdout=subprocess.PIPE,
                )
                print(f"Uninstalled {extension_id}")
            except subprocess.CalledProcessError as e:
                print(f"Failed to uninstall {extension_id}: {e.output}")
            # If extension_id is ms-azuretools.vscode-docker
            if extension_id == "ms-azuretools.vscode-docker":
                print("Re-Installing official Docker extension")
                subprocess.run(
                    code_cmd_args
                    + ["--install-extension", "ms-azuretools.vscode-docker"],
                    check=True,
                    stdout=subprocess.PIPE,
                )
                print("Re-Installed official Docker extension")
    sys.exit(0)

else:
    print("Unknown command")
    sys.exit(1)
