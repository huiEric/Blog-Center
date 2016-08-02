import sae

from blogcenter.myapp import app

application = sae.create_wsgi_app(app)

