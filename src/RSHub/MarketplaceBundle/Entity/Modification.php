<?php

namespace RSHub\MarketplaceBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * Modification
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RSHub\MarketplaceBundle\Entity\ModificationRepository")
 */
class Modification {
	/**
	 * @var integer
	 *
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;
	/**
	 * @ORM\ManyToMany(targetEntity="RSHub\MarketplaceBundle\Entity\Category", cascade={"persist"})
	 */
	private $categories;
	/**
	 * @var datetime
	 *
	 * @ORM\Column(name="date", type="datetime")
	 */
	private $date;
	/**
	 * @var string
	 *
	 * @ORM\Column(name="name", type="string", length=255)
	 */
	private $name;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="author", type="string", length=255)
	 */
	private $author;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="summary", type="string", length=255)
	 */
	private $summary;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="description", type="text")
	 */
	private $description;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="icon", type="string", length=255)
	 */
	private $icon;

	/**
	 * @var integer
	 *
	 * @ORM\Column(name="downloads", type="integer")
	 */
	private $downloads;

	/**
	 * @var integer
	 *
	 * @ORM\Column(name="stars", type="integer")
	 */
	private $stars;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="version", type="string", length=255)
	 */
	private $version;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="download_link", type="string", length=255)
	 */
	private $downloadLink;
	public function __construct() {
		// Si vous aviez déjà un constructeur, ajoutez juste cette ligne :
		$this->categories = new \Doctrine\Common\Collections\ArrayCollection();
		$this->date = new \Datetime;

	}

	/**
	 * Add categories
	 *
	 * @param Sdz\BlogBundle\Entity\Categorie $categories
	 */
	public function addCategorie(\Sdz\BlogBundle\Entity\Categorie $categorie) // addCategorie sans « s » !
	{
		// Ici, on utilise l'ArrayCollection vraiment comme un tableau, avec la syntaxe []
		$this->categories[] = $categorie;
	}

	/**
	 * Remove categories
	 *
	 * @param Sdz\BlogBundle\Entity\Categorie $categories
	 */
	public function removeCategorie(
			\Sdz\BlogBundle\Entity\Categorie $categorie) // removeCategorie sans « s » !
	{
		// Ici on utilise une méthode de l'ArrayCollection, pour supprimer la catégorie en argument
		$this->categories
				->removeElement($categorie);
	}

	/**
	 * Get categories
	 *
	 * @return Doctrine\Common\Collections\Collection
	 */
	public function getCategories() // Notez le « s », on récupère une liste de catégories ici !
	{
		return $this->categories;
	}
	/**
	 * Get id
	 *
	 * @return integer 
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * Set name
	 *
	 * @param string $name
	 * @return Modification
	 */
	public function setName($name) {
		$this->name = $name;

		return $this;
	}

	/**
	 * Get name
	 *
	 * @return string 
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * Set author
	 *
	 * @param string $author
	 * @return Modification
	 */
	public function setAuthor($author) {
		$this->author = $author;

		return $this;
	}

	/**
	 * Get author
	 *
	 * @return string 
	 */
	public function getAuthor() {
		return $this->author;
	}

	/**
	 * Set summary
	 *
	 * @param string $summary
	 * @return Modification
	 */
	public function setSummary($summary) {
		$this->summary = $summary;

		return $this;
	}

	/**
	 * Get summary
	 *
	 * @return string 
	 */
	public function getSummary() {
		return $this->summary;
	}

	/**
	 * Set description
	 *
	 * @param string $description
	 * @return Modification
	 */
	public function setDescription($description) {
		$this->description = $description;

		return $this;
	}

	/**
	 * Get description
	 *
	 * @return string 
	 */
	public function getDescription() {
		return $this->description;
	}

	/**
	 * Set icon
	 *
	 * @param string $icon
	 * @return Modification
	 */
	public function setIcon($icon) {
		$this->icon = $icon;

		return $this;
	}

	/**
	 * Get icon
	 *
	 * @return string 
	 */
	public function getIcon() {
		return $this->icon;
	}

	/**
	 * Set downloads
	 *
	 * @param integer $downloads
	 * @return Modification
	 */
	public function setDownloads($downloads) {
		$this->downloads = $downloads;

		return $this;
	}

	/**
	 * Get downloads
	 *
	 * @return integer 
	 */
	public function getDownloads() {
		return $this->downloads;
	}

	/**
	 * Set stars
	 *
	 * @param integer $stars
	 * @return Modification
	 */
	public function setStars($stars) {
		$this->stars = $stars;

		return $this;
	}

	/**
	 * Get stars
	 *
	 * @return integer 
	 */
	public function getStars() {
		return $this->stars;
	}

	/**
	 * Set version
	 *
	 * @param string $version
	 * @return Modification
	 */
	public function setVersion($version) {
		$this->version = $version;

		return $this;
	}

	/**
	 * Get version
	 *
	 * @return string 
	 */
	public function getVersion() {
		return $this->version;
	}

	/**
	 * Set downloadLink
	 *
	 * @param string $downloadLink
	 * @return Modification
	 */
	public function setDownloadLink($downloadLink) {
		$this->downloadLink = $downloadLink;

		return $this;
	}

	/**
	 * Get downloadLink
	 *
	 * @return string 
	 */
	public function getDownloadLink() {
		return $this->downloadLink;
	}

	/**
	 * @return the datetime
	 */
	public function getDate() {
		return $this->date;
	}

	/**
	 * @param datetime $date
	 */
	public function setDate(datetime $date) {
		$this->date = $date;
		return $this;
	}

}
