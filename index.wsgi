import sae

from blogcenter.blog import app

application = sae.create_wsgi_app(app)

