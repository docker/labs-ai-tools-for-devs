{ lib, python3Packages, sqlite-vec }:
with python3Packages;
buildPythonApplication rec {
  pname = "vectorstore";
  version = "0.1.0";
  src = ./.;
  dependencies = [
    setuptools
  ];
  propagatedBuildInputs = [langchain langchain-community langchain-openai sqlite-vec];
  nativeCheckInputs = [pytest];
  checkPhase = ''
  '';
  build-system = [
    setuptools
  ];
}

