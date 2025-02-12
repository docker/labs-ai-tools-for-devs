{ lib, python3Packages, fetchFromGitHub, clipboard }:
with python3Packages;
buildPythonApplication rec {
  pname = "codescope";
  version = "0.1.0";
  src = fetchFromGitHub {
    owner = "thomashirtz";
    repo = "codescope";
    rev = "6220411ea2cf5008a45801ba2029dddb3a3102a9";
    sha256 = "sha256-zLJDRjc4LNC3AutUa+tEmxeTbULb3AflKwrZmZb+i4U=";
  };
  dependencies = [
    setuptools
  ];
  propagatedBuildInputs = [mypy isort flake8 black pytest clipboard pyperclip];
  nativeCheckInputs = [pytest];
  checkPhase = ''
  '';
  build-system = [
    setuptools
  ];
}
