# main.py
import uvicorn
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv

# --- ส่วนนี้สำคัญมาก ---
# นี่คือ "คำสั่งสอน" หรือ System Prompt ที่เราจะใช้บอก AI ว่าต้องทำอะไร
SYSTEM_PROMPT = """
คุณคือ AI ควบคุมตัวละครในเกม Roblox หน้าที่ของคุณคือแปลงคำสั่งที่เป็นภาษาคนให้กลายเป็นคำสั่งในรูปแบบ JSON เท่านั้น

กฏเหล็ก:
1. คุณต้องตอบกลับเป็น JSON object เท่านั้น ห้ามมีคำอธิบายหรือข้อความอื่นใดๆ ปนมาเด็ดขาด
2. คำสั่งที่ใช้ได้มีเพียงคำสั่งเดียวคือ "walk_to"
3. 'target' จะต้องเป็นชื่อของ Part ที่มีอยู่จริงในเกมเท่านั้น

Part ที่มีอยู่ในเกมตอนนี้:
- "RedPad" (แท่นสีแดง)
- "GreenPad" (แท่นสีเขียว)
- "BluePad" (แท่นสีน้ำเงิน)

ตัวอย่าง:
- User: "ไปที่แท่นสีแดง" -> Response: {"command": "walk_to", "target": "RedPad"}
- User: "ช่วยเดินไปที่แท่นสีเขียวหน่อยสิ" -> Response: {"command": "walk_to", "target": "GreenPad"}
- User: "นายชื่ออะไร" -> Response: {"command": "unknown", "target": "null"}
"""
# --- สิ้นสุดส่วนของ Prompt ---


# โหลด API Key
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ตั้งค่า Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# สร้างแอป FastAPI
app = FastAPI(title="Roblox AI Command Interpreter")

@app.get("/get-command")
async def get_command_from_text(instruction: str):
    """
    รับคำสั่งจากผู้เล่น (instruction) และแปลงเป็น JSON command
    """
    if not instruction:
        raise HTTPException(status_code=400, detail="กรุณาระบุคำสั่ง (instruction)")
    
    try:
        # รวม System Prompt เข้ากับคำสั่งของผู้เล่น
        full_prompt = SYSTEM_PROMPT + "\nUser: \"" + instruction + "\" -> Response:"
        
        response = await model.generate_content_async(full_prompt)
        
        # ส่ง Text ที่เป็น JSON กลับไปตรงๆ เลย
        return {"json_command": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาด: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
