using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HungrySnake.Models
{
    [Serializable]
    public class ResponseModel
    {
        public String flag;
        public object data;
        public int rank;
    }
}