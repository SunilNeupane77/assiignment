# Quick Start Guide - New Features

## 🎯 Feature 1: Survey Scheduling

### Admin View - Creating a Scheduled Survey

1. **Navigate to Create Survey**
   ```
   Dashboard → Create Survey
   ```

2. **Fill Survey Details**
   - Title: "Q1 Customer Feedback"
   - Description: "Quarterly customer satisfaction survey"
   - Add questions as usual

3. **Set Schedule (NEW!)**
   ```
   Start Date:  [2024-01-01 00:00] ← Survey becomes available
   Expiry Date: [2024-03-31 23:59] ← Survey closes automatically
   ```

4. **Save Survey**
   - Survey is created but not accessible until start date
   - Automatically closes after expiry date

### User Experience

**Before Start Date:**
```
❌ Error: "Survey has not started yet"
```

**During Active Period:**
```
✅ Survey accessible and can be completed
```

**After Expiry Date:**
```
❌ Error: "Survey has expired"
```

---

## 📊 Feature 2: CSV Export

### Exporting Survey Results

1. **Navigate to Analytics**
   ```
   Dashboard → Analytics → Select Survey
   ```

2. **Click Export Button**
   ```
   [Export CSV] ← Top-right corner with download icon
   ```

3. **File Downloads Automatically**
   ```
   survey-507f1f77bcf86cd799439011-responses.csv
   ```

### CSV Structure

```csv
"Response ID","Submitted At","How satisfied are you?","What can we improve?","Rating"
"507f...011","2024-01-15T10:30:00.000Z","Very satisfied","Nothing","5"
"507f...012","2024-01-15T11:45:00.000Z","Satisfied","Faster support","4"
"507f...013","2024-01-15T14:20:00.000Z","Neutral","Better UI","3"
```

### Use Cases

**Excel Analysis:**
```
1. Open CSV in Excel
2. Create pivot tables
3. Generate charts
4. Calculate statistics
```

**Google Sheets:**
```
1. Import CSV to Google Sheets
2. Share with team
3. Collaborate on analysis
4. Create dashboards
```

**Data Warehouse:**
```
1. Import CSV to database
2. Join with other data
3. Run complex queries
4. Generate reports
```

---

## 🔧 API Usage Examples

### Creating Scheduled Survey

```javascript
// JavaScript/TypeScript
const survey = await surveyApi.createSurvey({
  title: "Employee Engagement Survey",
  description: "Annual engagement survey",
  questions: [
    {
      id: "q1",
      type: "rating",
      question: "How engaged do you feel?",
      required: true,
      order: 0
    }
  ],
  startDate: new Date("2024-06-01T00:00:00"),
  expiryDate: new Date("2024-06-30T23:59:59")
});
```

```bash
# cURL
curl -X POST http://localhost:5000/api/surveys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Employee Engagement Survey",
    "questions": [...],
    "startDate": "2024-06-01T00:00:00Z",
    "expiryDate": "2024-06-30T23:59:59Z"
  }'
```

### Exporting to CSV

```javascript
// JavaScript/TypeScript
const exportSurvey = async (surveyId) => {
  const response = await responseApi.exportCSV(surveyId);
  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `survey-${surveyId}-responses.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};
```

```bash
# cURL
curl -X GET http://localhost:5000/api/responses/export/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o survey-responses.csv
```

---

## 🎨 UI Components Added

### Create Survey Page
```
┌─────────────────────────────────────────────┐
│ ← Create Survey              [Save Survey]  │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────┬─────────────────────┐  │
│ │ Start Date      │ Expiry Date         │  │
│ │ [📅 2024-01-01] │ [📅 2024-03-31]    │  │
│ └─────────────────┴─────────────────────┘  │
│                                             │
│ [Survey Builder Component]                  │
│                                             │
└─────────────────────────────────────────────┘
```

### Analytics Page
```
┌─────────────────────────────────────────────┐
│ ← Back  Survey Title      [📥 Export CSV]   │
├─────────────────────────────────────────────┤
│                                             │
│ Total Responses: 150                        │
│                                             │
│ [Analytics Charts and Data]                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist for Testing

### Survey Scheduling
- [ ] Create survey with start date in future
- [ ] Verify survey is not accessible before start date
- [ ] Wait until start date and verify survey becomes accessible
- [ ] Create survey with expiry date
- [ ] Verify survey closes after expiry date
- [ ] Create survey without dates (should work as before)

### CSV Export
- [ ] Navigate to analytics page
- [ ] Click "Export CSV" button
- [ ] Verify CSV file downloads
- [ ] Open CSV in Excel/Google Sheets
- [ ] Verify all responses are present
- [ ] Check special characters are properly escaped
- [ ] Verify array values are joined with semicolons

---

## 🐛 Troubleshooting

### Survey Scheduling Issues

**Problem:** Survey not accessible even after start date
```
Solution: Check server timezone vs. client timezone
- Dates are stored in UTC
- Ensure proper timezone conversion
```

**Problem:** Survey still accessible after expiry
```
Solution: Clear browser cache and refresh
- Backend validates on each request
- Frontend may cache survey data
```

### CSV Export Issues

**Problem:** CSV download fails
```
Solution: Check authentication token
- Export requires valid JWT token
- Re-login if token expired
```

**Problem:** Special characters broken in CSV
```
Solution: Open with UTF-8 encoding
- Excel: Data → From Text/CSV → UTF-8
- Google Sheets: Import → UTF-8
```

---

## 📚 Additional Resources

- **Backend API Documentation:** See `backend/src/modules/*/README.md`
- **Frontend Components:** See `frontend/src/components/README.md`
- **Type Definitions:** See `*/src/types/index.ts`
- **Feature Documentation:** See `FEATURES_ADDED.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 You're All Set!

Both features are now fully integrated and ready to use. Enjoy the enhanced survey management capabilities!
