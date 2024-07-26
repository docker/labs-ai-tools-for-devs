all: make-binary pip-recs
# Install requirements
pip-recs:
	python3 -m pip install -r requirements.txt

# Install the package
make-binary: pip-recs
	pyinstaller -y --onefile install.py
