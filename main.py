-- สคริปต์ควบคุมการเคลื่อนไหวของ NPC ด้วยคำสั่งจาก API

local HttpService = game:GetService("HttpService")

-- อ้างอิงถึงตัวละครและ Humanoid
local npc = script.Parent
local humanoid = npc:WaitForChild("Humanoid")

-- URL ของ API ที่เราอัปเกรดแล้ว
local COMMAND_API_URL = "https://bestry69.github.io/fwffwf/" -- <<<<< ❗ ใส่ URL ของคุณ

-- ฟังก์ชันสำหรับแปลภาษาคนเป็นคำสั่งและทำให้ NPC เคลื่อนที่
local function executeInstruction(instruction)
	print("ได้รับคำสั่ง: '" .. instruction .. "' กำลังส่งไปให้ AI แปลผล...")

	-- สร้าง URL ที่สมบูรณ์
	local fullUrl = COMMAND_API_URL .. "?instruction=" .. HttpService:UrlEncode(instruction)
	
	-- เรียก API เพื่อขอ JSON command
	local success, response = pcall(function()
		return HttpService:GetAsync(fullUrl)
	end)

	if not success then
		warn("เรียก API ไม่สำเร็จ: ", response)
		return
	end

	-- แปลง JSON String ที่ได้จาก API กลับเป็น Lua Table
	local commandData = HttpService:JSONDecode(response)
    -- ดึง JSON จริงๆ ออกมาจาก key "json_command"
	local jsonCommandString = commandData.json_command
    local command = HttpService:JSONDecode(jsonCommandString)

	-- ตรวจสอบและทำตามคำสั่ง
	if command and command.command then
		print("AI แปลผลเป็นคำสั่ง: ", jsonCommandString)

		-- ถ้าเป็นคำสั่งให้เดิน
		if command.command == "walk_to" then
			local targetName = command.target
			local targetPart = workspace:FindFirstChild(targetName)

			-- ถ้าหาเป้าหมายเจอ
			if targetPart then
				print("กำลังเดินไปที่ " .. targetName)
				humanoid:MoveTo(targetPart.Position)
				
				-- รอจนกว่าจะเดินถึง
				humanoid.MoveToFinished:Wait()
				print("เดินถึง " .. targetName .. " แล้ว!")
			else
				warn("หาเป้าหมายไม่เจอ: " .. targetName)
			end
		
		-- ถ้าเป็นคำสั่งที่ไม่รู้จัก
		elseif command.command == "unknown" then
			print("AI ไม่เข้าใจคำสั่ง")
		end
	else
		warn("ไม่สามารถแปลผลคำสั่งจาก AI ได้: ", response)
	end
end

-- ######### ส่วนทดสอบ #########
-- รอ 3 วินาทีเพื่อให้เกมโหลดเสร็จ
task.wait(3)

-- ลองสั่งให้ AI เดิน
executeInstruction("ไปที่แท่นสีเขียว")
task.wait(2)
executeInstruction("เดินไปที่ BluePad")
task.wait(2)
executeInstruction("ไปที่ RedPad ทีสิ")
