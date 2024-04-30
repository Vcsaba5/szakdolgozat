-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3306
-- Létrehozás ideje: 2024. Már 26. 17:25
-- Kiszolgáló verziója: 8.2.0
-- PHP verzió: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `airsoft`
--
CREATE DATABASE IF NOT EXISTS `airsoft` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `airsoft`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ordering`
--

DROP TABLE IF EXISTS `ordering`;
CREATE TABLE IF NOT EXISTS `ordering` (
  `orderID` int NOT NULL AUTO_INCREMENT COMMENT 'a rendelés azonosítója',
  `userID` int NOT NULL COMMENT 'a felhasználó azonosítója',
  `termekID` int NOT NULL COMMENT 'a sorozat azonosítója',
  `orderDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'a rendelés ideje',
  `price` int NOT NULL COMMENT 'a megrendelés összértéke',
  PRIMARY KEY (`orderID`),
  KEY `fk_sorozat_order` (`termekID`),
  KEY `fk_user_order` (`userID`),
  KEY `termekID` (`termekID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ordering`
--

INSERT INTO `ordering` (`orderID`, `userID`, `termekID`, `orderDate`, `price`) VALUES
(1, 2, 3, '2024-02-11 20:23:46', 900),
(2, 9, 3, '2024-02-11 20:25:23', 1800),
(3, 2, 3, '2024-02-12 12:28:34', 360),
(4, 2, 3, '2024-02-13 05:49:30', 450),
(5, 2, 3, '2024-02-13 05:57:12', 450),
(6, 2, 3, '2024-02-13 06:37:29', 450),
(7, 2, 3, '2024-02-13 06:46:31', 450),
(8, 2, 3, '2024-02-14 06:20:10', 450),
(9, 2, 3, '2024-02-14 06:23:25', 900),
(10, 18, 1, '2024-03-26 12:10:05', 25000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rating`
--

DROP TABLE IF EXISTS `rating`;
CREATE TABLE IF NOT EXISTS `rating` (
  `ratingID` int NOT NULL AUTO_INCREMENT COMMENT 'Az értékelés azonosítója',
  `rating` decimal(10,1) NOT NULL COMMENT 'az adott sorozat értékelésének átlaga egy adott felhasználótól',
  `userID` int NOT NULL COMMENT 'a felhasználó azonosítója',
  `termekID` int NOT NULL COMMENT 'a sorozat azonosítója',
  PRIMARY KEY (`ratingID`),
  KEY `userID` (`userID`),
  KEY `seriesID` (`termekID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rating`
--

INSERT INTO `rating` (`ratingID`, `rating`, `userID`, `termekID`) VALUES
(6, 2.0, 2, 1),
(12, 4.0, 2, 2),
(13, 0.0, 2, 27),
(15, 2.0, 2, 9),
(21, 2.0, 2, 23),
(22, 3.0, 2, 3),
(23, 5.0, 3, 1),
(25, 3.0, 2, 31),
(26, 4.0, 2, 34),
(27, 3.0, 2, 4),
(37, 5.0, 3, 2),
(38, 5.0, 3, 3),
(39, 5.0, 3, 4),
(40, 5.0, 3, 31),
(41, 5.0, 3, 27),
(42, 5.0, 3, 23),
(43, 5.0, 3, 9),
(44, 5.0, 3, 34),
(45, 5.0, 3, 39),
(46, 1.0, 4, 1),
(47, 1.0, 4, 2),
(48, 1.0, 4, 3),
(49, 1.0, 4, 4),
(50, 1.0, 4, 31),
(51, 1.0, 4, 27),
(52, 1.0, 4, 23),
(53, 1.0, 4, 34),
(54, 1.0, 4, 39),
(55, 2.0, 5, 1),
(56, 2.0, 5, 2),
(57, 2.0, 5, 3),
(58, 2.0, 5, 4),
(59, 2.0, 5, 31),
(60, 2.0, 5, 27),
(61, 2.0, 5, 23),
(62, 2.0, 5, 9),
(63, 2.0, 5, 34),
(64, 2.0, 5, 39),
(65, 1.0, 6, 2),
(66, 1.0, 6, 1),
(67, 1.0, 6, 3),
(68, 2.0, 6, 4),
(69, 3.0, 6, 31),
(70, 1.0, 6, 27),
(71, 4.0, 6, 23),
(72, 5.0, 6, 34),
(73, 3.0, 6, 39),
(74, 5.0, 2, 40);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

DROP TABLE IF EXISTS `termekek`;
CREATE TABLE IF NOT EXISTS `termekek` (
  `termekID` int NOT NULL AUTO_INCREMENT COMMENT 'sorozat azonosítója',
  `name` varchar(60) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'sorozat címe',
  `termektipus` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'termektipusa',
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'a kép neve',
  `rating` decimal(10,1) NOT NULL COMMENT 'a sorozat értékelésének átlaga',
  `price` int NOT NULL COMMENT 'a termék ára',
  `stock` int NOT NULL COMMENT 'a termék darabszáma',
  PRIMARY KEY (`termekID`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`termekID`, `name`, `termektipus`, `image`, `rating`, `price`, `stock`) VALUES
(1, 'Airsoft puska M4 RIS DS4 karabély', 'Fegyver', 'asg-m4-ris-ds4-carbine-4.jpg', 2.2, 25000, 19),
(2, 'ASG Airsoft puska AK47 Arsenal SLR105', 'Fegyver', 'asg-ak47-arsenal-slr105-9.jpg', 2.6, 22500, 20),
(3, 'CYMA Airsoft géppisztoly CM.023 ', 'Fegyver', 'cyma-airsoft-submachine-gun-cm023-sportline-with-accessories.jpg', 2.4, 28000, 25),
(4, 'Tokyo Marui Airsoft FULL AUTO MAC11', 'Fegyver', 'tokyomarui-mac11-electric-blowback.jpg', 2.6, 20000, 30),
(9, 'CYMA Airsoft M870 sörétes puska összecsukható szárral', 'Fegyver', 'cyma-airsoft-m870-shotgun-with-the-folding-stock-short.jpg', 3.0, 33000, 20),
(23, 'Well Airsoft mesterlövész L96', 'Fegyver', 'well-mb01c-bk-detail.jpg', 2.8, 82000, 10),
(27, 'Snow Wolf Airsoft mesterlövész Kar98k', 'Fegyver', 'sw-kar98k-01_0x200.jpg', 1.8, 65000, 15),
(31, 'ASG Airsoft pisztoly CZ SP-01 SHADOW', 'Fegyver', 'asg-cz-sp-01-shadow-spring-manual-pistol.jpg', 2.8, 13000, 30),
(34, 'WE Airsoft pisztoly GP1799 T1', 'Fegyver', 'we-gp1799-t1-gbb-metal-black-slide-black-frame-gold-barrel.jpg', 3.4, 54000, 15),
(39, 'Well Airsoft pisztoly 1911 (P361M) teljes fém', 'Fegyver', 'well-colt-1911-a1-p361-spring-manual-pistol-fullmetal-1.jpg', 2.8, 15000, 30),
(40, 'ASG 12g CO2 gázpatron', 'Karbantartas', 'asg-12g-co2-gas-cartridge-ultrair-01_0x200.jpg', 5.0, 280, 2000),
(43, 'BLS Airsoft BBs BLS Precision Grade 0,25 g | 4000 ', 'Karbantartas', 'bls-precision-bbs-25g-2_0x200.jpg', 0.0, 4000, 1500),
(44, 'BLS Airsoft lövedékek BLS BIO Perfect 0,25 g | 400', 'Karbantartas', 'bls-bio-perfect-bbs-25g-1_0x200.jpg', 0.0, 6000, 1500),
(45, 'BLS Airsoft 90-100 BBs gyors töltő tár Commander', 'Karbantartas', 'blstransparent-bb-loader-2pcs_0x200.jpg', 0.0, 3300, 1500),
(46, 'G&G Átlátszó sebességű tár BB töltő - 90-100 BBs', 'Karbantartas', 'gg-transparent-speed-magazine-bb-loader-120-bbs-1_0x200.jpg', 0.0, 3400, 1500),
(47, 'VB Power NiMH akkumulátor 8,4V 1600mAh - Mini CQB', 'Karbantartas', 'nimh-battery-8-4v-1600mah-mini-cqb-1_0x200.jpg', 0.0, 10000, 150),
(48, 'TopArms NiMH akkumulátor 8,4V 1600mAh - Mini CQB', 'Karbantartas', 'toparms-nihm-battery-8-4v-1600mah-mini-cqb-1_0x200.jpg', 0.0, 10000, 150),
(49, 'EmersonGear Arcvédő STRIKE maszk hálóval', 'Felszereles', 'strike-mask-green-detail-01_0x200.jpg', 0.0, 6000, 100),
(50, '101 INC Arcvédő hálós maszk', 'Felszereles', '101-face-protecting-mesh-mask-sand-1_0x200.jpg', 0.0, 6000, 100),
(51, 'Ardon V2011 szemüveg', 'Felszereles', 'glasses-v2011-1_0x200.jpg', 0.0, 2000, 100),
(52, 'Pyramex Védőszemüveg', 'Felszereles', 'pyramex-protective-goggles-v2g-anti-fog-clear-1_0x200.jpg', 0.0, 8000, 100),
(53, 'EmersonGear FAST sisak', 'Felszereles', 'emersongear-fast-helmet-cheap-verison-black-1_0x200.jpg', 0.0, 12500, 50),
(54, 'Imperator Tactical MICH2000 katonai sisak másolat', 'Felszereles', 'it-hl-27-od-08_0x200.jpg', 0.0, 12500, 50),
(55, 'Imperator Tactical Levélszerű ghillie ruha', 'Felszereles', 'imperator-tactical-leaflike-ghillie-suit-woodland-body-01_0x200.jpg', 0.0, 25000, 20),
(56, 'A.C.M. Kétéltű AAV FSBE mellény', 'Felszereles', 'acm-amphibious-aav-fsbe-vest-olive-01_0x200.jpg', 0.0, 22000, 20),
(57, 'EmersonGear Jumer lemezhordozó háromszoros M4 tokkal és ball', 'Felszereles', 'emersongear-jumer-plate-carrier-with-triple-m4-pouch-and-dummy-ballistic-plates-od-10_0x200.jpg', 0.0, 37000, 15),
(58, 'Imperator Tactical Harci BDU egyenruha - Digital Woodland', 'Felszereles', 'imperator-tactical-aor2-00_0x200.jpg', 0.0, 22000, 20),
(59, 'EmersonGear Harci BDU nyári szett Gen2 -Highlander', 'Felszereles', 'eg-em6926c-01_0x200.jpg', 0.0, 40000, 15);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `userID` int NOT NULL AUTO_INCREMENT COMMENT 'a felhasználó azonosítója',
  `email` varchar(60) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'a felhasználó email címe',
  `username` varchar(20) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'a felhasználónév',
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'a felhasználó jelszava',
  `role` tinyint(1) NOT NULL COMMENT 'a felhasználó szerepköre: 0 = user, 1 = admin',
  `userImage` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'kép a sorozatról',
  `birthday` date DEFAULT NULL COMMENT 'a felhasználó születési dátuma',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`userID`, `email`, `username`, `password`, `role`, `userImage`, `birthday`) VALUES
(1, 'admin@admin.hu', 'horse admin', '$2b$10$L/qVB4PwCadNGYFx0/hV0exFDFoqCmZZgt1x3ROIjbAaixZ/D6XSS', 1, '2024_02_11_lovak1.jpg', '1989-03-16'),
(2, 'teszt@teszt.hu', 'teszt elek', '$2b$10$RmTMuozcn6bY0/1PvMxZt.KehNyOnXQCBydtJoQddsGcOAxIg/auW', 0, '2024_02_11_lovak4_optimized.jpg', '2005-02-24'),
(3, 'dfanni@email.hu', 'Fanni', '$2b$10$i8g8AqbdDStSYSh0qNTnvum.xhe0BUzKxXJedtx.aGzGPGufrOBTW', 0, 'no_image.png', NULL),
(4, 'hleila@email.hu', 'Leila', '$2b$10$/ymStZZInHCvozqPIEQri.FsE1dg4i4guLey/yU69nW7Xz2FxukpO', 0, 'no_image.png', NULL),
(5, 'kVanda@email.hu', 'Vanda', '$2b$10$Z8/DtJwxyMB3YopfDv7i3uOTcAfkT2SABDCvfW6PftnNziiUvGcaS', 0, 'no_image.png', NULL),
(6, 'lKrisztian@email.hu', 'Shifu', '$2b$10$vqr06VNw00PnfAMSwrxrT.tN8M7PHUmZ2uVConwkExxDolipaX/iW', 0, 'no_image.png', NULL),
(7, 'mSzabolcs@email.hu', 'Szabi', '$2b$10$wAOFRaS072EKbvPT7xscXuWv.WWHWxVoKeVdxhr6rIIj2gKfz7/P2', 0, 'no_image.png', NULL),
(8, 'sZsolt@email.hu', 'Zsolti', '$2b$10$X75VOw8ZU4BkaD2z6Z9eUumQWmsoHgX6becAr3pDOnG0rxRLFtPjG', 0, 'no_image.png', NULL),
(9, 'szMate@email.hu', 'Máté', '$2b$10$Rsws5TrHmcq3JJrxi9D43eCViK2XlTkv.20P6nSabFtJUNeKrAr4q', 0, 'no_image.png', NULL),
(15, 'verescsaba@gmail.com', 'csaba', '$2b$10$3kxsVlXxv66x6xoN84itPuStv6CLxhHSGfD4a5M9PptiTpwx2Gu1u', 0, 'no_image.png', NULL),
(16, 'vandakiss@thex.hu', 'thex', '$2b$10$cjwuLkmIaenJYJmFlcknPe3A1jfFDSOUXVH407Q5iZdq2AkcZo/su', 0, 'no_image.png', NULL),
(17, 'verescsaba2@email.hu', 'verescsabaAdmin', '$2b$10$pOlg3A2RtObM8Q4i9bnYiecVjXROZKt0QVfPLKkmIzVURB26MI/c6', 1, 'no_image.png', NULL),
(18, 'asd@asd.asd', 'asd', '$2b$10$MZVR51uX.W6wCd2C3z8RPuoZr7yfQz7lH9VCBZqpHP6OxTilQNWPy', 0, 'no_image.png', NULL);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ordering`
--
ALTER TABLE `ordering`
  ADD CONSTRAINT `fk_user_order` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ordering_ibfk_1` FOREIGN KEY (`termekID`) REFERENCES `termekek` (`termekID`);

--
-- Megkötések a táblához `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `fk_user_rating` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`termekID`) REFERENCES `termekek` (`termekID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
