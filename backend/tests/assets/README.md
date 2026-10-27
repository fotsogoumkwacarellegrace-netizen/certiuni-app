# Backend test assets

All records and documents in this folder are synthetic and intended only for automated tests.
They use reserved `.invalid` email addresses and must not be used as production or migration data.

- `data/students-valid.csv`: valid rows for `STUDENTS_IMPORT`.
- `data/students-invalid.csv`: missing fields and invalid email for row-validation tests.
- `data/diplomas-valid.csv`: valid rows for `DIPLOMAS_IMPORT`.
- `data/sample-records.json`: representative university, student, request, and certificate test records.
- `documents/sample-certificate.html`: printable fake diploma document marked as test-only.
- `uploads/unsupported-upload.txt`: unsupported-format input for upload validation tests.

Unit tests load these assets relative to their test file so they can be reused without depending on the current working directory.
