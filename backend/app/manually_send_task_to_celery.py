from app.worker import cel_app
# Replace 1 with your actual user_id
cel_app.send_task("monitor_user_task", args=[1])