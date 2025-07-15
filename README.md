# It's Ready - Food Freshness Analyzer

## Overview
It's Ready is a web application that allows users to take photos of raw food items and receive freshness analysis. The application processes images through a GPT-powered n8n workflow and returns structured information about the food's freshness status.

## Features
- Upload food images for freshness analysis
- Receive detailed assessment of food quality
- View estimated remaining freshness
- Get visual indicators of food condition
- Confidence level for each assessment

## Tech Stack
- **Backend**: Python/Flask
- **Frontend**: Next.js (to be developed)
- **Image Processing**: n8n workflow with GPT integration
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **Animations**: Framer Motion
- **Database**: NocoDB (optional integration)

## Getting Started

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd its-ready-app/backend
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Create a `.env` file based on `.env.example`
7. Run the application:
   ```
   python wsgi.py
   ```

### API Endpoints
- `POST /analyze` - Upload an image for freshness analysis
- `GET /healthcheck` - Check if the API is running

## Project Structure
```
its-ready-app/
├── backend/                   # Flask backend
│   ├── app/                   # Application package
│   │   ├── utils/             # Utility functions
│   │   │   ├── image_processor.py  # Image validation and processing
│   │   │   └── response_formatter.py  # Format API responses
│   │   ├── __init__.py        # App factory
│   │   └── routes.py          # API endpoints
│   ├── tests/                 # Test directory
│   ├── .env.example           # Example environment variables
│   ├── requirements.txt       # Python dependencies
│   └── wsgi.py                # WSGI entry point
├── docs/                      # Documentation
├── plan.md                    # Project plan
├── roadmap.md                 # Development roadmap
├── notes.md                   # Project notes
└── README.md                  # Project README
```

## License
[MIT](LICENSE)

## Acknowledgments
- Built with n8n workflow integration
