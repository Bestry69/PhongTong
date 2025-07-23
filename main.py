import uvicorn
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv

# โหลด API Key จากไฟล์ .env
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ตั้งค่า Google Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash') # เลือกรุ่นโมเดล

# สร้างแอป FastAPI
app = FastAPI(title="Gemini API Wrapper")

@app.get("/ask")
async def ask_gemini(question: str):
    """
    รับคำถามและส่งไปให้ Gemini ตอบ
    """
    if not question:
        raise HTTPException(status_code=400, detail="กรุณาระบุคำถาม (question)")

    try:
        # ส่งคำถามไปให้โมเดลประมวลผล
        response = await model.generate_content_async(question)
        return {"question": question, "answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาด: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
