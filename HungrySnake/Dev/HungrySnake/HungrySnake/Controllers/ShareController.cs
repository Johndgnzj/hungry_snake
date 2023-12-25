using HungrySnake.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HungrySnake.Helpers;

namespace HungrySnake.Controllers
{
    public class ShareController : ApiController
    {
        [Route("api/Share/{guiid}/{fbuid}")]
        [HttpGet]
        public ResponseModel ShareGame(int guiid, string fbuid)
        {
            var tmp_game = new HSDBHelper.hs_tmp_game().GETWithFBUid(guiid, fbuid);
            ResponseModel ret_obj = new ResponseModel();
            RankModel ranks = new RankModel();
            ranks.ranks = new List<RankModel.Rank>();
            List<RankModel.Rank> tmp_game_ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(tmp_game);
            ranks.ranks = tmp_game_ret;
            ret_obj.flag = "OK";
            ret_obj.data = ranks;
            
            if (tmp_game_ret.Count > 0)
            {
                ret_obj.rank = new HSDBHelper.hs_game_history().CheckRank(tmp_game_ret[0].score + (1 - (1.0 / tmp_game_ret[0].gametime)));
                WaterMarkHelper.CreateWaterMark(guiid.ToString(), tmp_game_ret[0].name, tmp_game_ret[0].score.ToString(), WaterMarkHelper.GetComment(tmp_game_ret[0].score));
            }
            
            return ret_obj;
        }
        
    }
}
