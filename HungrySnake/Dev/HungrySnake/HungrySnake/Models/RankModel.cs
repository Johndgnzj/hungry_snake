using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HungrySnake.Models
{
    [Serializable]
    public class RankModel
    {
        public List<Rank> ranks;
        public class Rank
        {
            public int guid;
            public String id;
            public String fbuid;
            public String name;
            public int gametime;
            public int score;
            public int beat;
        }

    }
}