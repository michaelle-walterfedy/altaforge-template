from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AltaForge App Template API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "version": "0.1.0"}


@app.get("/auth/status")
async def auth_status() -> dict[str, bool]:
    return {"authenticated": True}


@app.post("/auth/login")
async def auth_login() -> dict[str, bool]:
    return {"authenticated": True}


@app.post("/auth/logout")
async def auth_logout() -> dict[str, bool]:
    return {"authenticated": False}
