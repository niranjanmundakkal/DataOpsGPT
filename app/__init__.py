import os
from pathlib import Path

# Expose the backend/app package at the repository root.
# This allows top-level imports like `import app` from the workspace root.
__path__.insert(0, str(Path(__file__).resolve().parent.parent / "backend" / "app"))
