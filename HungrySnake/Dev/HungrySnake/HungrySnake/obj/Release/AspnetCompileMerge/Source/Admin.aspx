<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Admin.aspx.cs" Inherits="HungrySnake.Admin" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="images/favicon.png">
    <title>貪吃的魯蛇-維運後台</title>
    <link href="css/jquery-ui.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="src/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/signin.css"/>
    <link rel="stylesheet" href="css/dashboard.css" />
    <link href="css/jquery-ui.min.css" rel="stylesheet" />

    <script type="text/javascript" src="js/jquery-3.1.1.js"></script>
    <script src="src/bootstrap/js/bootstrap.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="css/i18n/datepicker-zh-TW.js"></script>
    <script src="js/highcharts.js"></script>
    <style>
        body {
          padding-top: 50px;
          padding-bottom: 20px;
        }
    </style>
    <script type="text/javascript">
        var data1 = <%=chart_Data1%>;
        var data2 = <%=chart_Data2%>;
        
        $(function () {
            var myDate = new Date();
            $("#datepicker").datepicker($.datepicker.regional["zh-TW"]).val(GetShortDateString(myDate));
            if (data1.length){
                Highcharts.chart('container', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '總遊戲人數'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y} 人</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.y} 人',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Brands',
                        colorByPoint: true,
                        data: data1
                    }]
                });
            }
        });
        function GetShortDateString(date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="Admin.aspx" style="top:0px"><img src="images/snake_logo.png" class="logo" style="display:none;" /></a>
                    <a class="navbar-brand" href="Admin.aspx">貪吃的魯蛇-維運後台</a>
                    <asp:Label ID="LoginAccount" runat="server" class="navbar-brand" style="margin-left:20px" />
                    &nbsp;
                    <asp:HyperLink ID="logoutLink" NavigateUrl="~/Admin.aspx?act=logout" runat="server">登出</asp:HyperLink>
                </div>
            </div>
        </nav>
        <asp:Panel ID="LoginPanel" runat="server">
            <div class="form-signin">
                <h2 class="form-signin-heading">Please sign in</h2>
                <label for="Account" class="sr-only">Account</label>
                <asp:TextBox ID="Account" runat="server" class="form-control" placeholder="Admin Account" required="" autofocus=""></asp:TextBox>
                <label for="Password" class="sr-only">Password</label>
                <asp:TextBox ID="Password" TextMode="Password" runat="server" class="form-control" placeholder="Password" required=""></asp:TextBox>
                <div class="checkbox">
                    <asp:CheckBox ID="remember" runat="server" Text="Remember me" />
                </div>
                <div>
                    <asp:Label ID="lblMsg" runat="server" />
                </div>
                <asp:Button ID="SignIn" class="btn btn-lg btn-primary btn-block" runat="server" Text="Sign in" OnClick="SignIn_Click" />
            </div>
        </asp:Panel>
        <asp:Panel ID="ContentPanel" runat="server">
<%--            <nav class="navbar navbar-default navbar-static-top" role="navigation">
                <div class="container">
                    <div class="navbar-header"><a class="navbar-brand" href="#">Project name</a></div>
                    <div id="navbar" class="navbar-collapse collapse">
                        <ul class="nav navbar-nav">
                            <li class="active"><a href="#">每日同上人數</a></li>
                            <li><a href="~/Admin.aspx?ctype=1" class="ctype-1">每日遊戲人數</a></li>
                            <li><a href="~/Admin.aspx?ctype=2" class="ctype-2">每日遊戲局數</a></li>
                            <li><a href="~/Admin.aspx?ctype=3" class="ctype-3">總遊戲人數</a></li>
                            <li><a href="~/Admin.aspx?ctype=4" class="ctype-4">總遊戲局數</a></li>
                            <li><a href="~/Admin.aspx?ctype=5" class="ctype-5">全球排行榜</a></li>
                        </ul>
                    </div>
                </div>
            </nav>--%>
            <div class="container-fluid"><div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <ul class="nav nav-sidebar">
                            <li><a href="Admin.aspx?ctype=0" class="ctype-0">每日同上人數</a></li>
                            <li><a href="Admin.aspx?ctype=1" class="ctype-1">每日遊戲人數</a></li>
                            <li><a href="Admin.aspx?ctype=2" class="ctype-2">每日遊戲局數</a></li>
                            <%--<li><a href="Admin.aspx?ctype=3" class="ctype-3">總遊戲人數</a></li>--%>
                            <%--<li><a href="Admin.aspx?ctype=4" class="ctype-4">總遊戲局數</a></li>--%>
                            <li><a href="Admin.aspx?ctype=5" class="ctype-5">全球排行榜</a></li>
                    </ul>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <h1 class="page-header">Dashboard</h1>
                    <div class="row placeholders">
                        <div class="col-xs-12 col-sm-6 placeholder">
                            <div id="container" style="min-width: 310px; height: 300px; max-width: 400px; margin: 0 auto"></div>
                        </div>
                        <div class="col-xs-12 col-sm-6 placeholder"><h4>總遊戲局數：<%=chart_Data2 %>場</h4><span class="text-muted">不過濾相同玩家</span></div>
<%--                        <div class="col-xs-6 col-sm-3 placeholder"><img data-src="holder.js/200x200/auto/sky" class="img-responsive" alt="200x200" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBEOEZEQiIvPjxnPjx0ZXh0IHg9Ijc1LjUiIHk9IjEwMCIgc3R5bGU9ImZpbGw6I0ZGRkZGRjtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0O2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjIwMHgyMDA8L3RleHQ+PC9nPjwvc3ZnPg==" data-holder-rendered="true"><h4>Label</h4><span class="text-muted">Something else</span></div>
                        <div class="col-xs-6 col-sm-3 placeholder"><img data-src="holder.js/200x200/auto/vine" class="img-responsive" alt="200x200" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM5REJBQyIvPjxnPjx0ZXh0IHg9Ijc1LjUiIHk9IjEwMCIgc3R5bGU9ImZpbGw6IzFFMjkyQztmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0O2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjIwMHgyMDA8L3RleHQ+PC9nPjwvc3ZnPg==" data-holder-rendered="true"><h4>Label</h4><span class="text-muted">Something else</span></div>--%>
                    </div>
                    <h2 class="sub-header">Section title</h2>
                    <div class="table-responsive">
                        <asp:TextBox ID="datepicker" runat="server"></asp:TextBox>
                        <button id="DoSearch" name="DoSearch">查詢</button>
                        <asp:Literal ID="top_pager" runat="server" />
                        <table class="table table-striped">
                            <thead>
                            <asp:Literal ID="thead" runat="server" />
                            </thead>
                            <tbody>
                                <asp:Literal ID="tbody" runat="server" />
                            </tbody>
                        </table>
                        <asp:Literal ID="bottom_pager" runat="server" />
                    </div>
                </div>
            </div>
            </div>
        </asp:Panel>

    </form>
    <script src="js/ie10-viewport-bug-workaround.js"></script>
    <script type="text/javascript">
        $(function () {
            $('.navbar-brand img').css({ 'height': '50px', 'position': 'absolute', 'left': '0px', 'top': '0px', 'display': 'block' });
            var currentMode = GetQueryStringParams("ctype");
            if (currentMode == "" || currentMode == undefined) currentMode = "0";
            $(".sub-header").html($(".ctype-" + currentMode).html());
            var itemname = $(".ctype-" + currentMode).html() + "<span class=\"sr-only\">(current)</span>";
            $(".ctype-" + currentMode).html(itemname).parent().addClass("active");
            $(".container-fluid").css('padding-top', $(".navbar-fixed-top").height());
            if (currentMode == 5){
                $("#datepicker").hide();
                $("#DoSearch").hide();
            }
        });
        function GetQueryStringParams(sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        }
    </script>
</body>
</html>
