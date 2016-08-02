import sae

from blog import app

application = sae.create_wsgi_app(app)
