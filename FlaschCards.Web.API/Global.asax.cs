using System.Web.Http;

namespace FlaschCards.Web.API
{
  public class WebApiApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      GlobalConfiguration.Configure(Register);
    }

    public static void Register(HttpConfiguration config)
    {
      config.MapHttpAttributeRoutes();
      config.Routes.MapHttpRoute("DefaultApi", "api/{controller}", new { controller = "home"});
    }
  }
}
