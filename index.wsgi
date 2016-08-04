from blog import app

if __name__=='__main__':
    app.run()
else:
    import sae
    application = sae.create_wsgi_app(app)
