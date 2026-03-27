# TODO: UPDATE FE MATCH DB SCHEMA

**Priority 1 - Data (mockData.js)**
✅ Livestock: category, tagCode, productionType=array, healthStatus
✅ Barns: match schema (type, capacity, currentCount, cleanliness)
✅ Staff: role, phone, email, address, avatar
✅ Tasks: description, category, priority, assigneeId, barnId, livestockId
✅ Feed: type, minQuantity, room, status
✅ Add: Vaccinations, Production, Activities (new exports)

**Priority 2 - Pages** 
- Livestock.jsx: Add tagCode, category=livestock/poultry, productionType multi-select
- Barns.jsx: Update to schema fields
- Staff.jsx: Add email, address, avatar column
- Tasks.jsx: Add description, FK selects

**Priority 3 - Backend**
- Mongoose schemas match

**Current Progress:** 0/3

