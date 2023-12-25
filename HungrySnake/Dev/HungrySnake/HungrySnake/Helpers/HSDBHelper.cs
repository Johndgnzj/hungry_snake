using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Data;
using System.Data.Common;

namespace HungrySnake.Helpers
{
    public class HSDBHelper
    {
        public class hs_global_rank
        {
            public string dbServer = ConfigurationManager.AppSettings["DbServer"].Trim();
            public const string table_name = "hs_global_rank";
            public String GET(int guid)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                cmd.CommandText += "where guid=@guid"; db.AddInParameter(cmd, "guid", DbType.Int16, guid);
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            public String GET(int offset, int pagesize)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ORDER BY score DESC,gametime DESC OFFSET {offset} ROWS FETCH NEXT {pagesize} ROWS ONLY";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            public String GET(string[] id)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} WHERE id in ('0'";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                for (int i = 0;i < id.Length; i++)
                {
                    if (i > 1000) break;
                    cmd.CommandText += " ,@id" + i; db.AddInParameter(cmd, "id" + i, DbType.String, id[i].ToString());
                }
                cmd.CommandText += ") ";
                cmd.CommandText += " ORDER BY score DESC,gametime DESC";
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            public bool Create(string id, string name, int gametime, int score)
            {
                using (Trans t = new Trans(dbServer))
                {
                    try
                    {
                        var ret = POST(id, name, gametime, score, t);
                        if (ret == 0) throw new Exception();//如果有異常會RollBack。
                        hs_game_history game_history = new hs_game_history();
                        ret = game_history.POST(id, name, gametime, score, t);
                        if (ret == 0) throw new Exception();//如果有異常會RollBack。
                        t.Commit();
                    }
                    catch 
                    {
                        t.RollBack();
                        return false;
                    }
                }
                return true;
            }
            public int POST(string id, string name, int gametime,int score, Trans t)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"INSERT INTO {table_name} (id,name,gametime,score) VALUES (@id,@name,@gametime,@score)";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                db.AddInParameter(cmd, "name", DbType.String, name);
                db.AddInParameter(cmd, "gametime", DbType.Int16, gametime);
                db.AddInParameter(cmd, "score", DbType.Int16, score);
                if (t == null) return db.ExecuteNonQuery(cmd);
                else return db.ExecuteNonQuery(cmd, t);
            }
            public void DELETE(string id, Trans t)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"DELETE FROM {table_name} WHERE id=@id";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                if (t == null) db.ExecuteNonQuery(cmd);
                else db.ExecuteNonQuery(cmd, t);
            }
            public bool Delete(string id)
            {
                using (Trans t = new Trans(dbServer))
                {
                    try
                    {
                        DELETE(id, t);
                        t.Commit();
                    }
                    catch
                    {
                        t.RollBack();
                        return false;
                    }
                }
                return true;
            }
        }
        public class hs_game_history
        {
            public string dbServer = ConfigurationManager.AppSettings["DbServer"].Trim();
            public const string table_name = "hs_game_history";
            public String GET(int offset, int pagesize)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ORDER BY score DESC,gametime DESC OFFSET {offset} ROWS FETCH NEXT {pagesize} ROWS ONLY";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            public String GET(string id)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} WHERE id=@id";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            public String GET(string[] id)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} WHERE id in ('0'";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                for (int i = 0; i < id.Length; i++)
                {
                    if (i > 1000) break;
                    cmd.CommandText += " ,@id" + i; db.AddInParameter(cmd, "id" + i, DbType.String, id[i].ToString());
                }
                cmd.CommandText += ") ";
                cmd.CommandText += " ORDER BY score DESC,gametime DESC";
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            public int CheckRank(double score)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT (count(guid)+1) rank FROM {table_name} WHERE (score + (1-(1.0/gametime)))>=@score";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "score", DbType.Double, score);
                DataTable dt = db.ExecuteDataTable(cmd);
                if (dt.Rows.Count > 0)
                    return Int32.Parse(dt.Rows[0]["rank"].ToString());
                else
                    return 0;
            }
            public int CheckTotalPlayerNumber()
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT count(*) FROM {table_name}";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                DataTable dt = db.ExecuteDataTable(cmd);
                if (dt.Rows.Count > 0)
                    return Int32.Parse(dt.Rows[0][0].ToString());
                else
                    return 0;
            }
            public bool Create(string id, string name, int gametime, int score)
            {
                using (Trans t = new Trans(dbServer))
                {
                    try
                    {
                        var ret = POST(id, name, gametime, score, t);
                        if (ret == 0) throw new Exception();//如果有異常會RollBack。
                        t.Commit();
                    }
                    catch
                    {
                        t.RollBack();
                        return false;
                    }
                }
                return true;
            }
            public int POST(string id, string name, int gametime, int score, Trans t)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"INSERT INTO {table_name} (id,name,gametime,score) VALUES (@id,@name,@gametime,@score)";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                db.AddInParameter(cmd, "name", DbType.String, name);
                db.AddInParameter(cmd, "gametime", DbType.Int16, gametime);
                db.AddInParameter(cmd, "score", DbType.Int16, score);
                if (t == null) return db.ExecuteNonQuery(cmd);
                else return db.ExecuteNonQuery(cmd, t);
            }
            public int PUT(int guid,string id, string name, int gametime, int score)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"UPDATE {table_name} SET id=@id,name=@name,gametime=@gametime,score=@score WHERE guid=@guid";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                db.AddInParameter(cmd, "name", DbType.String, name);
                db.AddInParameter(cmd, "gametime", DbType.Int16, gametime);
                db.AddInParameter(cmd, "score", DbType.Int16, score);
                db.AddInParameter(cmd, "guid", DbType.Int32, guid);
                return db.ExecuteNonQuery(cmd);
            }

            public void DELETE(string id, Trans t)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"DELETE FROM {table_name} WHERE id=@id";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                if (t == null) db.ExecuteNonQuery(cmd);
                else db.ExecuteNonQuery(cmd, t);
            }
            public bool Delete(string id)
            {
                using (Trans t = new Trans(dbServer))
                {
                    try
                    {
                        DELETE(id, t);
                        t.Commit();
                    }
                    catch
                    {
                        t.RollBack();
                        return false;
                    }
                }
                return true;
            }

        }
        public class hs_tmp_game
        {
            public string dbServer = ConfigurationManager.AppSettings["DbServer"].Trim();
            public const string table_name = "hs_tmp_game";
            public String GET()
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                cmd.CommandText += " ORDER BY guid DESC";
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            public String GET(string id)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                cmd.CommandText += "where id=@id"; db.AddInParameter(cmd, "id", DbType.String, id);
                cmd.CommandText += " ORDER BY guid DESC";
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);

            }
            
            public String GETWithFBUid(int guid, string fbuid)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                cmd.CommandText += "where fbuid=@fbuid"; db.AddInParameter(cmd, "fbuid", DbType.String, fbuid);
                cmd.CommandText += " and guid=@guid"; db.AddInParameter(cmd, "guid", DbType.Int32, guid);
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            public String GET(int guid, string id)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"SELECT * FROM {table_name} ";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                cmd.CommandText += "where id=@id"; db.AddInParameter(cmd, "id", DbType.String, id);
                cmd.CommandText += " and guid=@guid"; db.AddInParameter(cmd, "guid", DbType.Int32, guid);
                DataTable dt = db.ExecuteDataTable(cmd);
                return JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            public DataTable GETWithQuery(String SQL)
            {
                DbHelper db = new DbHelper(dbServer);
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                DataTable dt = db.ExecuteDataTable(cmd);
                return dt;
            }

            public bool Create(string id, string name, int gametime, int score)
            {
                using (Trans t = new Trans(dbServer))
                {
                    try
                    {
                        var ret = POST(id, name, gametime, score, t);
                        if (ret == 0) throw new Exception();//如果有異常會RollBack。
                        t.Commit();
                    }
                    catch (Exception ex)
                    {
                        t.RollBack();
                        return false;
                    }
                }
                return true;
            }
            public int POST(string id, string name, int gametime, int score, Trans t)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"INSERT INTO {table_name} (id,name,gametime,score) VALUES (@id,@name,@gametime,@score)";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                db.AddInParameter(cmd, "name", DbType.String, name);
                db.AddInParameter(cmd, "gametime", DbType.Int16, gametime);
                db.AddInParameter(cmd, "score", DbType.Int16, score);
                if (t == null) return db.ExecuteNonQuery(cmd);
                else return db.ExecuteNonQuery(cmd, t);
            }
            public int PUT(int guid, string id, string fbuid, string name, int gametime, int score)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"UPDATE {table_name} SET id=@id,name=@name,gametime=@gametime,score=@score,fbuid=@fbuid WHERE guid=@guid";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.String, id);
                db.AddInParameter(cmd, "name", DbType.String, name);
                db.AddInParameter(cmd, "gametime", DbType.Int16, gametime);
                db.AddInParameter(cmd, "score", DbType.Int16, score);
                db.AddInParameter(cmd, "fbuid", DbType.String, fbuid);
                db.AddInParameter(cmd, "guid", DbType.Int32, guid);
                return db.ExecuteNonQuery(cmd);
            }

            public void DELETE(int id, Trans t)
            {
                DbHelper db = new DbHelper(dbServer);
                string SQL = $"DELETE FROM {table_name} WHERE id=@id";
                DbCommand cmd = db.GetSqlStringCommond(SQL);
                db.AddInParameter(cmd, "id", DbType.Int32, id);
                if (t == null) db.ExecuteNonQuery(cmd);
                else db.ExecuteNonQuery(cmd, t);
            }
            public bool Delete(int id)
            {
                using (Trans t = new Trans(dbServer))
                {
                    try
                    {
                        DELETE(id, t);
                        t.Commit();
                    }
                    catch
                    {
                        t.RollBack();
                        return false;
                    }
                }
                return true;
            }
        }
    }
}