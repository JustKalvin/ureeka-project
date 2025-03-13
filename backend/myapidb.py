from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Request
from sqlmodel import SQLModel, Field, create_engine, Session, select
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, RedirectResponse
from typing import List, Optional
from datetime import datetime
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
import json

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL, echo=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BUKTI_FOLDER = "uploads"
os.makedirs(BUKTI_FOLDER, exist_ok=True)

class School(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    npsn: Optional[str] = Field(default=None, index=True)  # Sekarang opsional
    schoolName: str
    educationLevel: str
    address: str
    gpsCoordinates: Optional[str] = None  # Sekarang opsional
    studentCount: int


class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    text: str
    sentiment: str
    emoji: str
    time: datetime = Field(default_factory=datetime.utcnow)  # Ubah ini
    isDone: bool = False


class Laporan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nama: str
    email: str
    deskripsi: str
    bukti: Optional[str] = None

def get_session() :
  with Session(engine) as session : 
    yield session

@app.on_event("startup")
def init_db():
    SQLModel.metadata.create_all(engine)

@app.post("/add-school")
def add_school(school: School, session: Session = Depends(get_session)):
    if session.exec(select(School).where(School.npsn == school.npsn)).first():
        raise HTTPException(status_code=400, detail="Sekolah dengan NPSN ini sudah terdaftar!")
    session.add(school)
    session.commit()
    return {"message": "Sekolah berhasil ditambahkan!", "data": school}

@app.post("/add-unschool")
def add_school(school: School, session: Session = Depends(get_session)):
    session.add(school)
    session.commit()
    return {"message": "Sekolah berhasil ditambahkan!", "data": school}

@app.get("/datasekolah")
def get_school_data(session: Session = Depends(get_session)):
    return session.exec(select(School)).all()

@app.post("/feedbacks")
def add_feedback(feedback: Feedback, session: Session = Depends(get_session)):
    feedback.time = datetime.utcnow()  # Tetapkan waktu saat ini jika tidak diberikan
    session.add(feedback)
    session.commit()
    return {"message": "Feedback berhasil disimpan!"}

@app.get("/get-feedbacks")
def get_feedbacks(session: Session = Depends(get_session)):
    return session.exec(select(Feedback)).all()

@app.delete("/feedbacks/del/{feedback_id}")
def delete_feedback(feedback_id: int, session: Session = Depends(get_session)):
    feedback = session.get(Feedback, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback tidak ditemukan")
    session.delete(feedback)
    session.commit()
    return {"message": "Feedback berhasil dihapus!"}

@app.put("/handleIsDone/{id}")
def handle_is_done(id : int, session : Session = Depends(get_session)) :
    feedback = session.exec(select(Feedback).where(Feedback.id == id)).first()
    if(feedback is None) :
        raise HTTPException(status_code=404, detail = "Feedback not found")
    feedback.isDone = True
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return {"message": "Feedback marked as done", "feedback": feedback}

@app.post("/laporan")
async def buat_laporan(
    nama: str = Form(...),
    email: str = Form(...),
    deskripsi: str = Form(...),
    bukti: List[UploadFile] = File(None),
    session: Session = Depends(get_session)
):
    bukti_paths = []
    if bukti:
        for file in bukti:
            file_location = os.path.join(BUKTI_FOLDER, file.filename)
            with open(file_location, "wb") as f:
                f.write(await file.read())
            bukti_paths.append(file_location)
    laporan = Laporan(nama=nama, email=email, deskripsi=deskripsi, bukti=",".join(bukti_paths))
    session.add(laporan)
    session.commit()
    return {"message": "Laporan berhasil dikirim!", "data": laporan}

@app.get("/laporan")
def get_laporan(session: Session = Depends(get_session)):
    return session.exec(select(Laporan)).all()

MENU_MAKANAN_FILE = r"BACKEND_UREEKA/MenuMakanan.json"
@app.get("/menumakanan")
async def get_menu_makanan():
    with open(MENU_MAKANAN_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

IMAGES_FOLDER = r"BACKEND_UREEKA/ImageGrids"
@app.get("/imagegrids/{image_name}")
async def get_image(image_name: str):
    image_path = os.path.join(IMAGES_FOLDER, image_name)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Gambar tidak ditemukan")
    return FileResponse(image_path, media_type="image/png")

# Google OAuth
CLIENT_ID = "568493579356-lotcpl1h8gq6of5ete8g0eremp1ej73i.apps.googleusercontent.com"
CLIENT_SECRET = "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"
app.add_middleware(SessionMiddleware, secret_key="supersecretkey123")
# app.mount("/static", StaticFiles(directory="static"), name="static")

oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    client_kwargs={'scope': 'openid email profile'}
)

@app.get("/login")
async def login(request: Request):
    url = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, url)

@app.get("/auth")
async def auth(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user = token.get('userinfo')
        if user:
            request.session['user'] = dict(user)
        return RedirectResponse("http://localhost:5173/Profile")
    except OAuthError as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@app.get("/user")
async def get_user(request: Request):
    user = request.session.get('user')
    if not user:
        return JSONResponse(content={"error": "Unauthorized"}, status_code=401)
    return JSONResponse(content=user)

@app.get("/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return JSONResponse(content={"message": "Logged out successfully"}, status_code=200)
