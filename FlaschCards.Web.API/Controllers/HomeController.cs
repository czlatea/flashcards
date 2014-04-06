using System.Web.Http;

namespace FlaschCards.Web.API.Controllers
{
  public class HomeController : ApiController
  {
    [HttpGet]
    public string Get()
    {
      return "zzz";
    }
  }
}
