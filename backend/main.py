from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():

    return {
        "project": "VoxGuard AI",
        "status": "running"
    }