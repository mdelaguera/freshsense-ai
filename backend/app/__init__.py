from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()

def create_app(test_config=None):
    """Create and configure the Flask application"""
    app = Flask(__name__, instance_relative_config=True)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Default configuration
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev'),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # Limit upload size to 16MB
    )
    
    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Register blueprints
    from .routes import main_bp
    app.register_blueprint(main_bp)
    
    # Simple route to confirm the app is running
    @app.route('/healthcheck')
    def healthcheck():
        return {'status': 'ok'}
        
    return app
