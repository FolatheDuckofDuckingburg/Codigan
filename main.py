# main.py
def main():
    print("Welcome to Codigan!")
    import argparse

def greet(name: str):
    """Greet the user by name."""
    print(f"Hello, {name}! Welcome to Codigan.")

def perform_task(task: str):
    """Perform a specific task based on user input."""
    if task == "calculate":
        result = 2 + 2  # Example calculation
        print(f"Calculation result: {result}")
    elif task == "status":
        print("System status: All systems operational.")
    else:
        print(f"Unknown task: {task}")

def main():
    parser = argparse.ArgumentParser(description="Codigan Advanced Program")
    parser.add_argument("--name", type=str, help="Name of the user", default="User")
    parser.add_argument("--task", type=str, help="Task to perform", choices=["calculate", "status"])

    args = parser.parse_args()

    # Greet the user
    greet(args.name)

    # Perform the specified task
    if args.task:
        perform_task(args.task)
    else:
        print("No task specified. Use --task to specify a task.")

if __name__ == "__main__":
    main()

if __name__ == "__main__":
    main()
