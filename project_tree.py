import os

# Customize: folders/files to ignore
IGNORE = {'node_modules', '.git', '.vscode', '__pycache__', 'dist', 'build', '.idea', '.DS_Store'}
MAX_DEPTH = None  # Set to None if you want unlimited depth

def print_tree(start_path='.', prefix='', depth=0):
    if MAX_DEPTH is not None and depth > MAX_DEPTH:
        return

    entries = [e for e in os.listdir(start_path) if e not in IGNORE]
    entries.sort()

    for index, entry in enumerate(entries):
        path = os.path.join(start_path, entry)
        connector = '└── ' if index == len(entries) - 1 else '├── '
        print(prefix + connector + entry)

        if os.path.isdir(path):
            extension = '    ' if index == len(entries) - 1 else '│   '
            print_tree(path, prefix + extension, depth + 1)

if __name__ == '__main__':
    print_tree()
