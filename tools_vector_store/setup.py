from setuptools import setup, find_packages

setup(name='tools_query',
      version='1.0',
      # Modules to import from other scripts:
      packages=find_packages(),
      # Executables
      scripts=["query.py"],
     )
