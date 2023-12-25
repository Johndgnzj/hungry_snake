using HungrySnake.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using static HungrySnake.Helpers.HSDBHelper;

namespace HungrySnake.Controllers
{
    public class RankController : ApiController
    {
        // GET: api/Rank/5
        //[Route("api/Rank")]
        //[HttpGet]
        public RankModel GetRank(int offset,int pagesize)
        {
            RankModel ranks = new RankModel();
            
            ranks.ranks = new List<RankModel.Rank>();
            if ((offset + pagesize) <= 200)
            {
                List<RankModel.Rank> ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(new hs_game_history().GET(offset, pagesize));
                ranks.ranks = ret;
            }
            int totalPlayer = new hs_game_history().CheckTotalPlayerNumber();
            int i = 1;
            foreach (var r in ranks.ranks)
            {
                if (offset == 0 && i == 1)
                    r.beat = -1;
                else
                    r.beat = totalPlayer - (offset + i);
                i++;
            }
            //ranks.ranks.Add( new RankModel.Rank{ id = "1215767681779523", name = "黃小強", gametime = "166", score = "70" });
            //ranks.ranks.Add( new RankModel.Rank{ id = "10210609642467926", name = "黃小苪", gametime = "158", score = "60" });
            //ranks.ranks.Add( new RankModel.Rank{ id = "1292076920864901", name = "周昊子", gametime = "147", score = "50" });
            //ranks.ranks.Add( new RankModel.Rank{ id = "1292076920864901", name = "小美", gametime = "144", score = "40" });
            //ranks.ranks.Add( new RankModel.Rank { id = "1524632544218610", name = "大明", gametime = "100", score = "30" });
            //ranks.ranks.Add( new RankModel.Rank { id = "1213333582056152", name = "技安", gametime = "93", score = "20" });
            return ranks;
        }
        // GET: api/Rank/5
        //[Route("api/Rank/{id}")]
        //[HttpGet]
        public RankModel GetRank([FromUri] List<string> id)
        {
            if (id == null) return new RankModel() { ranks = new List<RankModel.Rank>() };
            if (id.Count() == 0) return new RankModel() { ranks = new List<RankModel.Rank>() };
            RankModel ranks = new RankModel();
            ranks.ranks = new List<RankModel.Rank>();
            List<RankModel.Rank> ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(new hs_game_history().GET(id.ToArray()));
            ranks.ranks = ret;
            int totalPlayer = id.Count();
            int i = 1;
            foreach (var r in ranks.ranks)
            {
                if (i == 1)
                    r.beat = -1;
                else
                    r.beat = totalPlayer -i;
                i++;
            }
            return ranks;
        }
        // GET: api/Rank/5
        //[Route("api/Rank/{id}")]
        //[HttpGet]
        //public RankModel GetRank(int id)
        //{
        //    RankModel ranks = new RankModel();
        //    ranks.ranks = new List<RankModel.Rank>();
        //    if (Regex.IsMatch((id + "0"), "^[0-9]+$")) { 
        //        List<RankModel.Rank> ret = JsonConvert.DeserializeObject<List<RankModel.Rank>>(new hs_global_rank().GET(id));
        //        ranks.ranks = ret;
        //    }
        //    return ranks;
        //}
        // POST: api/Rank
        public void Post([FromBody]RankModel.Rank value)
        {
            if (value != null)
            {
                var ret = new hs_global_rank().Create(value.id, value.name, value.gametime, value.score);
            }

        }

        // PUT: api/Rank/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Rank/5
        public void Delete(int id)
        {
        }
    }
}
