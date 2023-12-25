using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace HungrySnake.Helpers
{
    public class WaterMarkHelper
    {
        private static object lockLog = new object();
        public static void CreateWaterMark(String guid,String name,String Score, String Comment)
        {
           string sourceImage = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/images"), "share_cover.jpg");
            string targetImage = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/share"), guid + ".jpg");
            if (!System.IO.File.Exists(targetImage))
            {
                watermarkImage(sourceImage, name, Score, Comment, targetImage, ImageFormat.Jpeg);
            }
        }
        /// <summary>
        /// Add a text watermark to an image
        /// </summary>
        /// <param name="sourceImage">path to source image</param>
        /// <param name="text">text to add as a watermark</param>
        /// <param name="targetImage">path to the modified image</param>
        /// <param name="fmt">ImageFormat type</param>
        public static void watermarkImage(string sourceImage,String name, String Score, String Comment, string targetImage, ImageFormat fmt)
        {

            try
            {
                // open source image as stream and create a memorystream for output
                FileStream source = new FileStream(sourceImage, FileMode.Open);
                Stream output = new MemoryStream();
                Image img = Image.FromStream(source);
                float emSize = 40;
                // choose font for text

                //Font font = new Font("cwTeXYen", 36, FontStyle.Bold, GraphicsUnit.Pixel);
                Font font = new Font("中國龍特圓體", emSize, FontStyle.Bold, GraphicsUnit.Pixel);
                
                //choose color and transparency
                Color color = Color.FromArgb(255, 79, 140, 255);
                SolidBrush brush = new SolidBrush(color);

                //draw text on image
                Graphics graphics = Graphics.FromImage(img);
                // calculate font size after drawing 
                SizeF nameSize = new SizeF();
                nameSize = graphics.MeasureString(name, font);
                SizeF scoreSize = new SizeF();
                scoreSize = graphics.MeasureString(Score, font);
                //location of the watermark text in the parent image with offset.
                Point pt_name = new Point(600 - (int)(nameSize.Width / 2), 325);
                Point pt_rank = new Point(600 - (int)(scoreSize.Width / 2), 380);

                graphics.DrawString(name, font, brush, pt_name);
                graphics.DrawString(Score, font, brush, pt_rank);
                graphics.Dispose();

                //update image memorystream
                img.Save(output, fmt);
                Image imgFinal = Image.FromStream(output);

                //write modified image to file
                Bitmap bmp = new System.Drawing.Bitmap(img.Width, img.Height, img.PixelFormat);
                Graphics graphics2 = Graphics.FromImage(bmp);
                graphics2.DrawImage(imgFinal, new Point(0, 0));
                bmp.Save(targetImage, fmt);

                imgFinal.Dispose();
                img.Dispose();
                source.Dispose();
                output.Dispose();
            }
            catch (Exception ex)
            {
                string folderName = System.Web.Hosting.HostingEnvironment.MapPath("~/log");
                string filePath = folderName + "/" + DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                if (!Directory.Exists(folderName))
                    Directory.CreateDirectory(folderName);

                lock (lockLog)
                {
                    //把內容寫到目的檔案，若檔案存在則附加在原本內容之後(換行)
                    File.AppendAllText(filePath, ex.ToString());
                }


            }
        }
        public static String GetComment(int Myscore)
        {
            if (Myscore >= 0 && Myscore < 50) return "頭髮都比你粗長!";
            if (Myscore >= 50 && Myscore < 100) return "細小君94 ni";
            if (Myscore >= 100 && Myscore < 150) return "我只承認你是毛毛蟲";
            if (Myscore >= 150 && Myscore < 200) return "勉強看出是條蛇";
            if (Myscore >= 200 && Myscore < 250) return "可以跟姚明對尬了!";
            if (Myscore >= 250 && Myscore < 300) return "長這麼快會骨質疏鬆歐";
            if (Myscore >= 300 && Myscore < 350) return "航空母艦蛇4ni";
            if (Myscore >= 350 && Myscore < 400) return "你真的沒有打生長激素嗎?";
            if (Myscore >= 400 && Myscore < 450) return "粗長君94 ni";
            if (Myscore >= 450 && Myscore < 500) return "你再長下去101要哭了";
            if (Myscore >= 500 && Myscore < 600) return "101都沒你屌!";
            if (Myscore >= 600 && Myscore < 700) return "拜蛇王能保佑我長高嗎?";
            if (Myscore >= 700 && Myscore < 800) return "大蛇王94 ni";
            if (Myscore >= 800 && Myscore < 900) return "杜拜塔開始緊張了";
            if (Myscore >= 900 && Myscore < 1000) return "杜拜塔都甘拜下風啦!";
            if (Myscore >= 1000 && Myscore < 1100) return "一公里長的蛇有看過嗎?";
            if (Myscore >= 1100 && Myscore < 1200) return "蛇神請受我一拜!";
            if (Myscore >= 1200 && Myscore < 1300) return "大蛇神94 ni";
            if (Myscore >= 1300 && Myscore < 1400) return "龍都比你小隻";
            if (Myscore >= 1400 && Myscore < 1500) return "神已經不足以形容了";
            if (Myscore >= 1500) return "邁入超蛇神的境界";
            return "頭髮都比你粗長!";
        }
    }
}