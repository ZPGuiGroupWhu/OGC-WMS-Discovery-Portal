import cv2
import numpy as np
import math


# 用于表示区域生长法提取地图主体是的初始点
class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def getX(self):
        return self.x

    def getY(self):
        return self.y


def getGrayDiff(img, currentPoint, tmpPoint):
    return abs(int(img[currentPoint.x, currentPoint.y]) - int(img[tmpPoint.x, tmpPoint.y]))


def selectConnects(p):
    if p != 0:
        connects = [Point(-1, -1), Point(0, -1), Point(1, -1), Point(1, 0), Point(1, 1),
                    Point(0, 1), Point(-1, 1), Point(-1, 0)]
    else:
        connects = [Point(0, -1), Point(1, 0), Point(0, 1), Point(-1, 0)]
    return connects


# 利用区域生长法提取地图主体
# param
#   image, 地图图片
# return
#   binaryImg, 地图主体，numpy.ndarray(shape=[w,h])
def regionGrow(image, thresh=10, p=1):
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    seeds = [Point(10, 10), Point(20, 200), Point(20, 350), Point(100, 370), Point(190, 360), Point(190, 100),
             Point(190, 10), Point(100, 10)]

    height, weight = image.shape
    seedMark = np.zeros(image.shape)
    seedList = []
    for seed in seeds:
        seedList.append(seed)
    label = 1
    connects = selectConnects(p)
    while len(seedList) > 0:
        currentPoint = seedList.pop(0)
        seedMark[currentPoint.x, currentPoint.y] = label
        for i in range(8):
            tmpX = currentPoint.x + connects[i].x
            tmpY = currentPoint.y + connects[i].y
            if tmpX < 0 or tmpY < 0 or tmpX >= height or tmpY >= weight:
                continue
            grayDiff = getGrayDiff(image, currentPoint, Point(tmpX, tmpY))
            if grayDiff < thresh and seedMark[tmpX, tmpY] == 0:
                seedMark[tmpX, tmpY] = label
                seedList.append(Point(tmpX, tmpY))
    binaryImg = seedMark
    binaryImg[(binaryImg == 0)] = 255
    binaryImg[(binaryImg == 1)] = 0
    return binaryImg


# 使用大津法二值化图像，用于将MC方法得到的显著性灰度图转化为二值图
def otsu(image):
    if len(image.shape) == 2 or (len(image.shape) == 3 and image.shape[2] == 1):
        gray = image
    else:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    ret, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return th


# 计算地图图片前后景的信息熵差异，计算方法见学姐论文公式3-6
# param
#   image, numpy ndarray类型的地图图片
#   mask, 地图图片掩膜
def entropy_diff(image, mask):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    if len(mask.shape) == 3:
        if mask.shape[2] == 3:
            mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
        elif mask.shape[2] == 1:
            mask = mask[:, :, 0]
    height, width = gray.shape
    for i in range(height):
        for j in range(width):
            mask_value = mask[i][j]
            if mask_value < (255 / 2):
                mask[i, j] = 0
            else:
                mask[i, j] = 255
    front_pixels = {}
    back_pixels = {}
    front_pixel_num = 0
    back_pixel_num = 0
    for i in range(height):
        for j in range(width):
            pixel_value = gray[i][j]
            mask_value = mask[i][j]
            if mask_value == 0:
                back_pixel_num += 1
                if pixel_value in back_pixels.keys():
                    back_pixels[pixel_value] += 1
                else:
                    back_pixels[pixel_value] = 1
            else:
                front_pixel_num += 1
                if pixel_value in front_pixels.keys():
                    front_pixels[pixel_value] += 1
                else:
                    front_pixels[pixel_value] = 1
    front_pixels = [(x[0], x[1] / front_pixel_num) for x in front_pixels.items()]
    back_pixels = [(x[0], x[1] / back_pixel_num) for x in back_pixels.items()]
    front_entropy = sum([-x[1] * math.log2(x[1]) for x in front_pixels])
    back_entropy = sum([-x[1] * math.log2(x[1]) for x in back_pixels])
    return front_entropy - back_entropy


# 根据前后景信息熵差异计算地图主体
# param
#   image, numpy ndarray类型的地图图片
#   mc_mask, 使用马尔科夫链（Markov Chain）方法得到的地图图片主体
#   rg_mask, 使用区域生长法（Region Growth）得到的地图图片主体
# return
#   mask, 根据前后景信息熵差异计算的地图主体
def get_image_mainpart(image, mc_mask, rg_mask):
    mc_ed = entropy_diff(image, mc_mask)
    rg_ed = entropy_diff(image, rg_mask)
    # 选择前后景信息熵差异最大的结果作为地图主体
    mask = mc_mask if mc_ed >= rg_ed else rg_mask
    # 如果前后景信息熵差异小于1.3（论文给出的经验值），则将整个图像作为主体
    if max(mc_ed, rg_ed) < 1.3:
        mask[:, :] = 255
    mask = mask.astype(np.uint8)
    return mask


# 480维颜色特征
# param
#   image, 待提取特征的图像，cv2.COLOR_RGB
#   mask, 图像主体掩膜，图像主体像素值为255
# return
#   hist, 480维的颜色特征
def get_hist480(image, mask):
    # 图像转换到HSV空间
    image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    
    # 将掩膜转换为二值图像
    if len(mask.shape) == 3:
        mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
        ret, mask = cv2.threshold(mask, 0, 255, cv2.THRESH_BINARY)
    # 计算颜色直方图
    hist = cv2.calcHist([image], [0, 1, 2], mask, [12, 8, 5], [0, 256, 0, 256, 0, 256])
    hist = hist.flatten()
    # print(sum(mask.flatten().tolist()) / 255, sum(hist.tolist()))
    # 归一化
    # cv2.normalize(hist, hist)
    cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
    # print(np.max(hist), np.min(hist))
    return hist


# 构建Gabor滤波器，6个尺度、4个波长、8个方向，共192个滤波器
def build_filters():
    filters = []
    ksizes = [0, 1, 5, 10, 20, 25]  # gabor尺度，6个
    lamdas = [1, 3, 5, 10]  # 波长, 4个
    thetas = [22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180]  # gabor方向，8个
    for theta in thetas:
        for lamda in lamdas:
            for ksize in ksizes:
                kern = cv2.getGaborKernel((ksize, ksize), 1.0, theta, lamda, 0.5, 0, ktype=cv2.CV_32F)
                kern /= 1.5 * kern.sum()
                filters.append(kern)
    return filters


# 384维gabor纹理特征
# param
#   image, 待提取特征的图像，多维数组
#   filters, 6 * 4 * 8 = 192个滤波器
#   mask, 图像主体掩膜，图像主体像素值为255
# return
#   hist, 384维的颜色特征
def get_gabor384(image, filters, mask):
    res = []    # 滤波结果
    for kern in filters:
        fimg = cv2.filter2D(image, cv2.CV_8UC1, kern)
        fimg = fimg[mask == 255]
        fmean = np.mean(fimg[:])
        fstd = np.std(fimg[:])
        res.append(fmean)
        res.append(fstd)
    res = np.array(res)
    # cv2.normalize(res, res)
    cv2.normalize(res, res, 0, 1, cv2.NORM_MINMAX)
    # print(np.max(res), np.min(res))
    return res  # 返回滤波结果,结果为24幅图，按照gabor角度排列



