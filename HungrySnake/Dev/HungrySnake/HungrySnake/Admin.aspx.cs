using HungrySnake.Helpers;
using HungrySnake.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace HungrySnake
{
    public partial class Admin : System.Web.UI.Page
    {
        private string _account = "Efun@Admin";
        private string _password = "Efun@Admin";//"Efun@169";
        public string chart_Data1 = "[]", chart_Data2 = "''";
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Request["act"]?.ToString() == "logout")
                {
                    Session["login_account"] = "";
                }
                SetLoginStatus(Session["login_account"]?.ToString());
            }
            else
            {
                ShowAllGamePlayer();
                ShowAllGame();

                string cType = Request.QueryString["ctype"] + "";
                switch (cType)
                {
                    case "0":
                    case "":
                        CheckNDU();
                        break;
                    case "1":
                    case "3":
                        CheckPlayer(cType);
                        break;
                    case "5":
                        CheckAllLoginPlayerRank();
                        break;
                    default:
                        break;
                }
            }
        }

        private void ShowAllGame()
        {
            HSDBHelper.hs_tmp_game dbhelper = new HSDBHelper.hs_tmp_game();
            String SQL = @"select count(id) allgame from hs_tmp_game; ";
            DataTable dt = dbhelper.GETWithQuery(SQL);
            chart_Data2 = string.Format("{0:N2}",dt.Rows[0]["allgame"]);
        }

        private void ShowAllGamePlayer()
        {
            HSDBHelper.hs_tmp_game dbhelper = new HSDBHelper.hs_tmp_game();
            DataTable dt = dbhelper.GETWithQuery("SELECT (COUNT(*)-1) digit FROM (SELECT DISTINCT name FROM hs_tmp_game) Q;");
            string login = dt.Rows[0]["digit"] + "";
            dt = dbhelper.GETWithQuery("SELECT (COUNT(*)-1) digit FROM (SELECT DISTINCT (CASE WHEN name = '' THEN id ELSE '' END) id FROM hs_tmp_game) Q;");
            string nonlogin = dt.Rows[0]["digit"] + "";
            chart_Data1 = "[{\"name\":\"有登入\",\"y\":" + login + "},{\"name\":\"未登入\",\"y\":" + nonlogin + "}]";
        }

        protected void SignIn_Click(object sender, EventArgs e)
        {
            if (Account.Text == _account && Password.Text == _password)
            {
                if (remember.Checked)
                {
                    Response.Cookies["UserData"]["account"] = Account.Text;
                }
                else
                {
                    Response.Cookies.Clear();
                }
                Session["login_account"] = _account;
                SetLoginStatus(Session["login_account"]?.ToString());
            }
            else
            {
                lblMsg.Text = "登入失敗";
            }
        }
        private void SetLoginStatus(String account)
        {
            if (string.IsNullOrEmpty(account))
            {
                // not login
                LoginPanel.Visible = true;
                Account.Text = Request.Cookies?["UserData"]?["account"];
                logoutLink.Visible = false;
                ContentPanel.Visible = false;
            }
            else
            {
                // login
                LoginAccount.Text = "登入者：" + account;
                logoutLink.Visible = true;
                LoginPanel.Visible = false;
                ContentPanel.Visible = true;
                ShowAllGamePlayer();
                ShowAllGame();
                string cType = Request.QueryString["ctype"] + "";
                if (cType == "5")
                {
                    CheckAllLoginPlayerRank();
                }
            }
        }

        #region AllTypeQuery
        /// <summary>
        /// 不重複玩家的遊戲人數
        /// </summary>
        private void CheckNDU()
        {
            HSDBHelper.hs_tmp_game dbhelper = new HSDBHelper.hs_tmp_game();
            String query_date = Request.Form["datepicker"] + "";
            DateTime tryDate;
            if (!DateTime.TryParse(query_date, out tryDate)) return;
            String SQL = @"SELECT count(id) num,Dur FROM (
                            select Distinct id,CONVERT(CHAR(13), createtime, 20) Dur from hs_tmp_game
                            where createtime between '" + query_date + " 00:00:00' AND '" + query_date + " 23:59:59') Q GROUP BY Dur ORDER BY Dur ASC; ";
            DataTable dt = dbhelper.GETWithQuery(SQL);
            Dictionary<String, string> data = new Dictionary<string, string>();
            for (int i = 0; i < 24; i++)
            {
                data.Add(string.Format("{0:00} ~ {1:00}", i, i + 1), "0");
            }
            for (int j = 0;j < dt.Rows.Count; j++)
            {
                int insKey = int.Parse( dt.Rows[j]["Dur"].ToString().Substring(11, 2));
                data[data.ElementAt(insKey).Key] = string.Format("{0:N}", dt.Rows[j]["num"].ToString());
            }
            this.thead.Text = "<tr><td>Time</td><td>Player count </td></tr>";
            this.tbody.Text = "";
           foreach (var s in data)
            {
                this.tbody.Text += $"<tr><td>{s.Key}</td><td>{s.Value}</td></tr>";
            }
        }

        /// <summary>
        /// 查詢登入/未登入的遊戲人數，cType=1 =>對應日期；cType=3 =>全伺服器
        /// </summary>
        /// <param name="cType"></param>
        private void CheckPlayer(String cType)
        {
            HSDBHelper.hs_tmp_game dbhelper = new HSDBHelper.hs_tmp_game();
            String query_date = Request.Form["datepicker"] + "",SQL = "";
            DateTime tryDate;
            if (DateTime.TryParse(query_date, out tryDate))
            {
                SQL = @"select Dur, SUM(CASE WHEN name='' THEN 0 ELSE 1 END) login,SUM(CASE WHEN name='' THEN 1 ELSE 0 END) nonlogin from (
                            select Distinct name,CONVERT(CHAR(10), createtime, 20) Dur from hs_tmp_game
                            where createtime between '" + query_date + " 00:00:00' AND '" + query_date + " 23:59:59') Q GROUP BY Dur ORDER BY Dur ASC; ";
            }
            else
            {
                SQL = @"select Dur, SUM(CASE WHEN name='' THEN 0 ELSE 1 END) login,SUM(CASE WHEN name='' THEN 1 ELSE 0 END) nonlogin from (
                            select Distinct name,CONVERT(CHAR(10), createtime, 20) Dur from hs_tmp_game) Q GROUP BY Dur ORDER BY Dur ASC; ";
            }
            DataTable dt = dbhelper.GETWithQuery(SQL);
            this.thead.Text = "<tr><td> - </td><td>Login</td><td> Non Login </td></tr>";
            this.tbody.Text = "";
            if( dt.Rows.Count ==0)
                this.tbody.Text += $"<tr><td>{query_date}</td><td>0</td><td>0</td></tr>";

            for (int j = 0; j < dt.Rows.Count; j++)
            {
                this.tbody.Text += $"<tr><td>{dt.Rows[j]["Dur"].ToString()}</td><td>{dt.Rows[j]["login"].ToString()}</td><td>{dt.Rows[j]["nonlogin"].ToString()}</td></tr>";
            }
        }

        private void CheckAllLoginPlayerRank()
        {
            HSDBHelper.hs_game_history dbhelper = new HSDBHelper.hs_game_history();
            string page_num ="0" +  Request.QueryString["p"];
            int current_page = int.Parse(page_num);
            int page_size = 100;
            List<RankModel.Rank> ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(dbhelper.GET(current_page * page_size, page_size));

            this.thead.Text = "<tr><td>Rank</td><td>FB Uid</td><td>FB Name</td><td>Score</td><td>Game Time</td></tr>";
            this.tbody.Text = "";
            double current_idx = 1 + int.Parse(page_num) * page_size;
            if (ret.Count() == 0)
                this.tbody.Text += $"<tr><td colspan='5'>無資料</td></tr>";
            foreach (var r in ret) {
                this.thead.Text += string.Format("<tr><td>{0}</td><td><img src=\"http://graph.facebook.com/{1}/picture\" alt='{1}'></td><td>{2}</td><td>{3}</td><td>{4}</td></tr>"
                    , current_idx++, r.id, r.name, r.score, r.gametime);
            }
            double totalPlayer = dbhelper.CheckTotalPlayerNumber();
            string pager = "";
            if (current_page == 0)
            {
                pager = "<span class='pager_diable'>前一頁</span>";
            }else
            {
                pager = "<a href='admin.aspx?ctype=5&p=" + (current_page - 1).ToString() + "'>前一頁</a>";
            }
            if (current_page+1 < Math.Ceiling(totalPlayer/page_size))
            {
                pager +=" | <a href='admin.aspx?ctype=5&p=" + (current_page + 1).ToString() + "'>下一頁</a>";
            }else
            {
                pager += "| <span class='pager_diable'>下一頁</span>";
            }
            top_pager.Text  = pager;
            bottom_pager.Text = pager;
        }
    #endregion
}
}