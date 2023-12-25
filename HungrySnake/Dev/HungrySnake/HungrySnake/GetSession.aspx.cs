using System;
namespace HungrySnake
{
    public partial class GetSession : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string TempUid = Session.SessionID.ToString();
            //if (Session["sessionid"] == null) Session["sessionid"] = TempUid;
            Session["sessionid"] = TempUid;
            Response.Write(Session["sessionid"]);
        }
    }
}