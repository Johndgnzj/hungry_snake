using HungrySnake.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Web.Http;
using static HungrySnake.Helpers.HSDBHelper;

namespace HungrySnake.Controllers
{
    public class GameController : ApiController
    {
        // GET: api/Game/5
        public ResponseModel Get(int id, string tmp_session_id)
        {
            var tmp_game = new hs_tmp_game().GET(id, tmp_session_id);
            ResponseModel ret_obj = new ResponseModel();
            RankModel ranks = new RankModel();

            ranks.ranks = new List<RankModel.Rank>();

            List<RankModel.Rank> tmp_game_ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(tmp_game);
            ranks.ranks = tmp_game_ret;
            ret_obj.flag = "OK";
            ret_obj.data = ranks;
            if (tmp_game_ret.Count > 0)
            {
                ret_obj.rank = new hs_game_history().CheckRank(tmp_game_ret[0].score + (1 - (1.0 / tmp_game_ret[0].gametime)));
            }
            return ret_obj;
        }
        public ResponseModel Get()
        {
            var tmp_game = new hs_tmp_game().GET();
            ResponseModel ret_obj = new ResponseModel();
            RankModel ranks = new RankModel();

            ranks.ranks = new List<RankModel.Rank>();

            List<RankModel.Rank> tmp_game_ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(tmp_game);
            ranks.ranks = tmp_game_ret;
            ret_obj.flag = "OK";
            ret_obj.data = ranks;
            return ret_obj;
        }

        // POST: api/Game
        /// <summary>
        /// 暫存遊戲結果
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public ResponseModel Post([FromBody]RankModel.Rank value)
        {
            ResponseModel ret_obj = new ResponseModel();
            hs_tmp_game myDbHelper = new hs_tmp_game();
            ret_obj.flag = "Err";
            if (value != null)
            {
                var ret = myDbHelper.Create(value.id, value.name, value.gametime, value.score);
                if (ret)
                {
                    var current_game = myDbHelper.GET(value.id);
                    List<RankModel.Rank> ret2 = JsonConvert.DeserializeObject<List<RankModel.Rank>>(current_game);
                    if (ret2.Count >= 1)
                    {
                        ret_obj.flag = "OK";
                        ret_obj.data = ret2[0].guid;
                        ret_obj.rank = new hs_game_history().CheckRank(ret2[0].score + (1 - (1.0 / ret2[0].gametime)));
                    }
                }
            }
            return ret_obj;
        }

        // PUT: api/Game/5
        [Route("api/Game/{id}/{tmp_session_id}")]
        [HttpPut]
        public ResponseModel UpdateGame(int id, string tmp_session_id, [FromBody]RankModel.Rank value)
        {
            ResponseModel ret_obj = new ResponseModel();
            ret_obj.flag = "Err";
            if (value != null)
            {
                var tmp_game = new hs_tmp_game().GET(id, tmp_session_id);
                List<RankModel.Rank> tmp_game_ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(tmp_game);
                if (tmp_game_ret.Count == 1)
                {
                    var Put_tmp_ret = new hs_tmp_game().PUT(id, tmp_session_id,value.id, value.name, tmp_game_ret[0].gametime, tmp_game_ret[0].score);
                   ret_obj.flag = "OK";
                    var my_game = new hs_game_history().GET(value.id);
                    List<RankModel.Rank> my_game_ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(my_game);
                    if (my_game_ret.Count == 1)
                    {
                        var Put_ret = new hs_game_history().PUT(my_game_ret[0].guid, value.id, value.name, Math.Max(my_game_ret[0].gametime, tmp_game_ret[0].gametime), Math.Max(my_game_ret[0].score, tmp_game_ret[0].score));
                        ret_obj.data = Put_ret;
                    }
                    else
                    {
                        var Put_ret = new hs_game_history().Create(value.id, value.name, tmp_game_ret[0].gametime, tmp_game_ret[0].score);
                        ret_obj.data = Put_ret;
                    }
                }
            }
            return ret_obj;
        }

        // DELETE: api/Game/5
        public void Delete(int id)
        {
        }
    }
}
