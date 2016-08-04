from blog import app

if __name__=='__main__':
    app.run()
else:
    import sae
    from sae.ext.shell import ShellMiddleware
    application = sae.create_wsgi_app(app)
